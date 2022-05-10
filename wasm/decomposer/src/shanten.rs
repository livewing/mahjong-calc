use crate::{data::DecomposeResult, decomposer::decompose};
use serde::Serialize;
use std::cmp::Ordering;

#[derive(Clone, Debug, Default, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize)]
pub struct MinShanten {
    shanten: i32,
    results: Vec<DecomposeResult>,
}

pub fn decompose_min_shanten(counts: &[u8], meld: i32) -> MinShanten {
    decompose(counts).into_iter().fold(
        MinShanten {
            shanten: i32::MAX,
            results: vec![],
        },
        |r, cur| {
            let s = cur.shanten(meld);
            match s.cmp(&r.shanten) {
                Ordering::Less => MinShanten {
                    shanten: s,
                    results: vec![cur],
                },
                Ordering::Equal => MinShanten {
                    shanten: s,
                    results: {
                        let mut v = r.results;
                        v.push(cur);
                        v
                    },
                },
                Ordering::Greater => r,
            }
        },
    )
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::{
        counts::Counts,
        data::{Block, BlockType},
    };

    #[test]
    fn pattern1m() {
        #[rustfmt::skip]
        let r = decompose_min_shanten(&[
            1, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0
        ], 4);
        assert_eq!(
            r,
            MinShanten {
                shanten: 0,
                results: vec![DecomposeResult {
                    #[rustfmt::skip]
                    rest: Counts::with(&[
                        1, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0
                    ]),
                    blocks: vec![]
                }]
            }
        );
    }

    #[test]
    fn pattern123333m23p789s77z() {
        #[rustfmt::skip]
        let r = decompose_min_shanten(&[
            1, 1, 4, 0, 0, 0, 0, 0, 0,
            0, 1, 1, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 1, 1, 1,
            0, 0, 0, 0, 0, 0, 2
        ], 0);
        assert_eq!(
            r,
            MinShanten {
                shanten: 0,
                results: vec![DecomposeResult {
                    #[rustfmt::skip]
                    rest: Counts::with(&[
                        0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0
                    ]),
                    blocks: vec![
                        Block {
                            block_type: BlockType::Kotsu,
                            tile: 2
                        },
                        Block {
                            block_type: BlockType::Shuntsu,
                            tile: 0
                        },
                        Block {
                            block_type: BlockType::Shuntsu,
                            tile: 24
                        },
                        Block {
                            block_type: BlockType::Ryammen,
                            tile: 10
                        },
                        Block {
                            block_type: BlockType::Toitsu,
                            tile: 33
                        }
                    ]
                }]
            }
        );
    }

    #[test]
    fn pattern1112345678999m() {
        #[rustfmt::skip]
        let r = decompose_min_shanten(&[
            3, 1, 1, 1, 1, 1, 1, 1, 3,
            0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0
        ], 0);
        assert_eq!(r.shanten, 0);
        assert_eq!(r.results.len(), 10);
    }

    #[test]
    fn pattern19m19p19s1234567z() {
        #[rustfmt::skip]
        let r = decompose_min_shanten(&[
            1, 0, 0, 0, 0, 0, 0, 0, 1,
            1, 0, 0, 0, 0, 0, 0, 0, 1,
            1, 0, 0, 0, 0, 0, 0, 0, 1,
            1, 1, 1, 1, 1, 1, 1
        ], 0);
        assert_eq!(
            r,
            MinShanten {
                shanten: 8,
                results: vec![DecomposeResult {
                    #[rustfmt::skip]
                    rest: Counts::with(&[
                        1, 0, 0, 0, 0, 0, 0, 0, 1,
                        1, 0, 0, 0, 0, 0, 0, 0, 1,
                        1, 0, 0, 0, 0, 0, 0, 0, 1,
                        1, 1, 1, 1, 1, 1, 1
                    ]),
                    blocks: vec![]
                }]
            }
        )
    }
}
