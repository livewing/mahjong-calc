pub mod numbers;

use crate::{
    counts::{Counts, PackedCharacterCounts},
    data::{Block, BlockType, DecomposeResult},
};
use itertools::Itertools;
use std::{collections::HashSet, vec};

use self::numbers::mentsu_and_tatsu_numbers;

fn isolated(mut counts: Counts) -> (DecomposeResult, Counts) {
    let mut blocks = vec![];
    let mut isolated_counts = Counts::new();

    for t in 0..3 {
        let number_counts = match t {
            0 => &mut counts.m,
            1 => &mut counts.p,
            2 => &mut counts.s,
            _ => unreachable!(),
        };
        for i in 0..9 {
            if number_counts.get(i) >= 3 {
                let mut dec = true;
                for j in i.saturating_sub(2)..=(i + 2).min(8) {
                    if i == j {
                        continue;
                    }
                    if number_counts.get(j) > 0 {
                        dec = false;
                        break;
                    }
                }
                if dec {
                    number_counts.set_by(i, |c| c - 3);
                    blocks.push(Block {
                        block_type: BlockType::Kotsu,
                        tile: (t * 9 + i) as u8,
                    })
                }
            }
            if i <= 6
                && number_counts.get(i + 0) == 1
                && number_counts.get(i + 1) == 1
                && number_counts.get(i + 2) == 1
            {
                let mut dec = true;
                for j in i.saturating_sub(2)..=(i + 4).min(8) {
                    if j >= i && j <= i + 2 {
                        continue;
                    }
                    if number_counts.get(j) > 0 {
                        dec = false;
                        break;
                    }
                }
                if dec {
                    number_counts.set_by(i + 0, |c| c - 1);
                    number_counts.set_by(i + 1, |c| c - 1);
                    number_counts.set_by(i + 2, |c| c - 1);
                    blocks.push(Block {
                        block_type: BlockType::Shuntsu,
                        tile: (t * 9 + i) as u8,
                    })
                }
            }
            if number_counts.get(i) == 1 {
                let mut dec = true;
                for j in i.saturating_sub(2)..=(i + 2).min(8) {
                    if i == j {
                        continue;
                    }
                    if number_counts.get(j) > 0 {
                        dec = false;
                        break;
                    }
                }
                if dec {
                    number_counts.set_by(i, |c| c - 1);
                    match t {
                        0 => &mut isolated_counts.m,
                        1 => &mut isolated_counts.p,
                        2 => &mut isolated_counts.s,
                        _ => unreachable!(),
                    }
                    .set_by(i, |c| c + 1);
                }
            }
        }
    }

    for i in 0..7 {
        if counts.z.get(i) >= 3 {
            counts.z.set_by(i, |c| c - 3);
            blocks.push(Block {
                block_type: BlockType::Kotsu,
                tile: (27 + i) as u8,
            })
        }
        if counts.z.get(i) == 1 {
            counts.z.set_by(i, |c| c - 1);
            isolated_counts.z.set_by(i, |c| c + 1);
        }
    }

    blocks.sort_unstable();

    (
        DecomposeResult {
            blocks,
            rest: counts,
        },
        isolated_counts,
    )
}

fn character_toitsu(mut counts: PackedCharacterCounts) -> DecomposeResult {
    let mut blocks = vec![];
    for i in 0..7 {
        if counts.get(i) >= 2 {
            counts.set_by(i, |c| c - 2);
            blocks.push(Block {
                block_type: BlockType::Toitsu,
                tile: (27 + i) as u8,
            })
        }
    }
    DecomposeResult {
        rest: {
            let mut c = Counts::new();
            c.z = counts;
            c
        },
        blocks,
    }
}

fn mentsu_and_tatsu(counts: Counts) -> HashSet<DecomposeResult> {
    let mut ret = HashSet::new();
    let mps = (0..3).map(|t| {
        mentsu_and_tatsu_numbers(match t {
            0 => counts.m,
            1 => counts.p,
            2 => counts.s,
            _ => unreachable!(),
        })
        .into_iter()
        .map(move |r| r.to_decompose_result(t))
        .collect_vec()
    });

    let z = character_toitsu(counts.z);

    ret.extend(mps.into_iter().multi_cartesian_product().map(|v| {
        let m = v[0].clone();
        let p = v[1].clone();
        let s = v[2].clone();
        DecomposeResult {
            rest: Counts {
                m: m.rest.m,
                p: p.rest.p,
                s: s.rest.s,
                z: z.rest.z,
            },
            blocks: m
                .blocks
                .into_iter()
                .chain(p.blocks.into_iter())
                .chain(s.blocks.into_iter())
                .chain(z.blocks.clone().into_iter())
                .collect(),
        }
    }));

    ret
}

fn head_and_mentsu(counts: Counts) -> HashSet<DecomposeResult> {
    let mut ret = HashSet::new();

    for t in 0..3 {
        let candidates = match t {
            0 => &counts.m,
            1 => &counts.p,
            2 => &counts.s,
            _ => unreachable!(),
        }
        .iter()
        .enumerate()
        .filter_map(|(i, c)| if c >= 2 { Some(i) } else { None });
        for candidate in candidates {
            let mut rest = counts;
            match t {
                0 => &mut rest.m,
                1 => &mut rest.p,
                2 => &mut rest.s,
                _ => unreachable!(),
            }
            .set_by(candidate, |c| c - 2);
            ret.extend(mentsu_and_tatsu(rest).into_iter().map(
                |DecomposeResult { rest, mut blocks }| DecomposeResult {
                    rest,
                    blocks: {
                        blocks.push(Block {
                            block_type: BlockType::Toitsu,
                            tile: (t * 9 + candidate) as u8,
                        });
                        blocks.sort_unstable();
                        blocks
                    },
                },
            ))
        }
    }

    let candidates = counts
        .z
        .iter()
        .enumerate()
        .filter_map(|(i, c)| if c >= 2 { Some(i) } else { None });
    for candidate in candidates {
        let mut rest = counts;
        rest.z.set_by(candidate, |c| c - 2);
        ret.extend(mentsu_and_tatsu(rest).into_iter().map(
            |DecomposeResult { rest, mut blocks }| DecomposeResult {
                rest,
                blocks: {
                    blocks.push(Block {
                        block_type: BlockType::Toitsu,
                        tile: (27 + candidate) as u8,
                    });
                    blocks.sort_unstable();
                    blocks
                },
            },
        ))
    }

    ret.extend(mentsu_and_tatsu(counts));

    ret
}

pub fn decompose(counts: &[u8]) -> HashSet<DecomposeResult> {
    let (DecomposeResult { rest, blocks }, iso) = isolated(Counts::with(counts));
    let isolated_blocks = blocks;
    let mut ret = HashSet::new();
    ret.extend(
        head_and_mentsu(rest)
            .into_iter()
            .map(|DecomposeResult { rest, mut blocks }| DecomposeResult {
                rest: rest + iso,
                blocks: {
                    blocks.extend(isolated_blocks.clone());
                    blocks.sort_unstable();
                    blocks
                },
            }),
    );
    ret
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn pattern1m() {
        #[rustfmt::skip]
        let r = decompose(&[
            1, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0
        ]);
        assert_eq!(r.len(), 1);
        assert_eq!(
            r.into_iter().next().unwrap(),
            DecomposeResult {
                #[rustfmt::skip]
                rest: Counts::with(&[
                    1, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0
                ]),
                blocks: vec![]
            }
        )
    }

    #[test]
    fn pattern123333m23p789s77z() {
        #[rustfmt::skip]
        let r = decompose(&[
            1, 1, 4, 0, 0, 0, 0, 0, 0,
            0, 1, 1, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 1, 1, 1,
            0, 0, 0, 0, 0, 0, 2
        ]);
        assert_eq!(r.len(), 26);
    }

    #[test]
    fn pattern1112345678999m() {
        #[rustfmt::skip]
        let r = decompose(&[
            3, 1, 1, 1, 1, 1, 1, 1, 3,
            0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0
        ]);
        assert_eq!(r.len(), 628);
    }

    #[test]
    fn pattern1112233778899p() {
        #[rustfmt::skip]
        let r = decompose(&[
            0, 0, 0, 0, 0, 0, 0, 0, 0,
            3, 2, 2, 0, 0, 0, 2, 2, 2,
            0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0
        ]);
        assert_eq!(r.len(), 509);
    }

    #[test]
    fn pattern2233445566778s() {
        #[rustfmt::skip]
        let r = decompose(&[
            0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 2, 2, 2, 2, 2, 2, 1, 0,
            0, 0, 0, 0, 0, 0, 0
        ]);
        assert_eq!(r.len(), 3022);
    }
}
