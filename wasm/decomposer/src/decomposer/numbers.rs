use crate::{
    counts::PackedNumberCounts,
    data::{Block, BlockType, NumberDecomposeResult},
};
use std::collections::HashSet;

fn kotsu(counts: PackedNumberCounts) -> HashSet<NumberDecomposeResult> {
    let candidates: Vec<_> = counts
        .iter()
        .enumerate()
        .filter_map(|(i, c)| if c >= 3 { Some(i) } else { None })
        .collect();
    let mut ret = HashSet::new();

    if candidates.is_empty() {
        ret.insert(NumberDecomposeResult {
            rest: counts,
            blocks: vec![],
        });
        return ret;
    }

    for candidate in candidates.into_iter() {
        let mut rest = counts;
        rest.set_by(candidate, |c| c - 3);
        for f in [kotsu, shuntsu] {
            ret.extend(&mut f(rest).into_iter().map(
                |NumberDecomposeResult { rest, mut blocks }| NumberDecomposeResult {
                    rest,
                    blocks: {
                        blocks.push(Block {
                            block_type: BlockType::Kotsu,
                            tile: candidate as u8,
                        });
                        blocks.sort_unstable();
                        blocks
                    },
                },
            ));
        }
    }
    ret
}

fn shuntsu(counts: PackedNumberCounts) -> HashSet<NumberDecomposeResult> {
    let candidates: Vec<_> = (&counts.iter().collect::<Vec<_>>()[..])
        .windows(3)
        .enumerate()
        .filter_map(|(i, cs)| {
            if cs.iter().all(|&c| c > 0) {
                Some(i)
            } else {
                None
            }
        })
        .collect();
    let mut ret = HashSet::new();

    if candidates.is_empty() {
        ret.insert(NumberDecomposeResult {
            rest: counts,
            blocks: vec![],
        });
        return ret;
    }

    for candidate in candidates.into_iter() {
        let mut rest = counts;
        rest.set_by(candidate, |c| c - 1);
        rest.set_by(candidate + 1, |c| c - 1);
        rest.set_by(candidate + 2, |c| c - 1);
        for f in [kotsu, shuntsu] {
            ret.extend(&mut f(rest).into_iter().map(
                |NumberDecomposeResult { rest, mut blocks }| NumberDecomposeResult {
                    rest,
                    blocks: {
                        blocks.push(Block {
                            block_type: BlockType::Shuntsu,
                            tile: candidate as u8,
                        });
                        blocks.sort_unstable();
                        blocks
                    },
                },
            ));
        }
    }
    ret
}

fn toitsu(counts: PackedNumberCounts, recurse: usize) -> HashSet<NumberDecomposeResult> {
    let candidates: Vec<_> = counts
        .iter()
        .enumerate()
        .filter_map(|(i, c)| if c >= 2 { Some(i) } else { None })
        .collect();
    let mut ret = HashSet::new();

    if recurse == 0 || candidates.is_empty() {
        ret.insert(NumberDecomposeResult {
            rest: counts,
            blocks: vec![],
        });
        return ret;
    }

    for candidate in candidates.into_iter() {
        let mut rest = counts;
        rest.set_by(candidate, |c| c - 2);
        for f in [toitsu, ryammen_and_penchan, kanchan] {
            ret.extend(&mut f(rest, recurse - 1).into_iter().map(
                |NumberDecomposeResult { rest, mut blocks }| NumberDecomposeResult {
                    rest,
                    blocks: {
                        blocks.push(Block {
                            block_type: BlockType::Toitsu,
                            tile: candidate as u8,
                        });
                        blocks.sort_unstable();
                        blocks
                    },
                },
            ));
        }
    }
    ret
}

fn ryammen_and_penchan(
    counts: PackedNumberCounts,
    recurse: usize,
) -> HashSet<NumberDecomposeResult> {
    let candidates: Vec<_> = (&counts.iter().collect::<Vec<_>>()[..])
        .windows(2)
        .enumerate()
        .filter_map(|(i, cs)| {
            if cs.iter().all(|&c| c > 0) {
                Some(i)
            } else {
                None
            }
        })
        .collect();
    let mut ret = HashSet::new();

    if recurse == 0 || candidates.is_empty() {
        ret.insert(NumberDecomposeResult {
            rest: counts,
            blocks: vec![],
        });
        return ret;
    }

    for candidate in candidates.into_iter() {
        let mut rest = counts;
        rest.set_by(candidate, |c| c - 1);
        rest.set_by(candidate + 1, |c| c - 1);
        for f in [toitsu, ryammen_and_penchan, kanchan] {
            ret.extend(&mut f(rest, recurse - 1).into_iter().map(
                |NumberDecomposeResult { rest, mut blocks }| NumberDecomposeResult {
                    rest,
                    blocks: {
                        blocks.push(Block {
                            block_type: if candidate == 0 || candidate == 7 {
                                BlockType::Penchan
                            } else {
                                BlockType::Ryammen
                            },
                            tile: candidate as u8,
                        });
                        blocks.sort_unstable();
                        blocks
                    },
                },
            ));
        }
    }
    ret
}

fn kanchan(counts: PackedNumberCounts, recurse: usize) -> HashSet<NumberDecomposeResult> {
    let candidates: Vec<_> = (&counts.iter().collect::<Vec<_>>()[..])
        .windows(3)
        .enumerate()
        .filter_map(|(i, cs)| {
            if cs[0] > 0 && cs[2] > 0 {
                Some(i)
            } else {
                None
            }
        })
        .collect();
    let mut ret = HashSet::new();

    if recurse == 0 || candidates.is_empty() {
        ret.insert(NumberDecomposeResult {
            rest: counts,
            blocks: vec![],
        });
        return ret;
    }

    for candidate in candidates.into_iter() {
        let mut rest = counts;
        rest.set_by(candidate, |c| c - 1);
        rest.set_by(candidate + 2, |c| c - 1);
        for f in [toitsu, ryammen_and_penchan, kanchan] {
            ret.extend(&mut f(rest, recurse - 1).into_iter().map(
                |NumberDecomposeResult { rest, mut blocks }| NumberDecomposeResult {
                    rest,
                    blocks: {
                        blocks.push(Block {
                            block_type: BlockType::Kanchan,
                            tile: candidate as u8,
                        });
                        blocks.sort_unstable();
                        blocks
                    },
                },
            ));
        }
    }
    ret
}

fn tatsu(counts: PackedNumberCounts, recurse: usize) -> HashSet<NumberDecomposeResult> {
    let mut ret = HashSet::new();
    for f in [toitsu, ryammen_and_penchan, kanchan] {
        ret.extend(f(counts, recurse))
    }
    ret
}

pub fn mentsu_and_tatsu_numbers(counts: PackedNumberCounts) -> HashSet<NumberDecomposeResult> {
    let mut mentsu = HashSet::new();
    for f in [kotsu, shuntsu] {
        mentsu.extend(f(counts))
    }
    let mut ret = HashSet::new();
    mentsu.into_iter().for_each(|mr| {
        ret.extend(
            tatsu(mr.rest, (4 - mr.blocks.len()).max(0))
                .into_iter()
                .map(|mut tr| NumberDecomposeResult {
                    rest: tr.rest,
                    blocks: {
                        let mut v = mr.blocks.clone();
                        v.append(&mut tr.blocks);
                        v.sort_unstable();
                        v
                    },
                }),
        );
    });
    ret
}
