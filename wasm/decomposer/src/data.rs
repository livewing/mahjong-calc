use crate::counts::{Counts, PackedNumberCounts};
use serde::Serialize;

#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize)]
pub enum BlockType {
    #[serde(rename = "kotsu")]
    Kotsu,
    #[serde(rename = "shuntsu")]
    Shuntsu,
    #[serde(rename = "ryammen")]
    Ryammen,
    #[serde(rename = "penchan")]
    Penchan,
    #[serde(rename = "kanchan")]
    Kanchan,
    #[serde(rename = "toitsu")]
    Toitsu,
}

#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize)]
pub struct Block {
    #[serde(rename = "type")]
    pub block_type: BlockType,
    pub tile: u8,
}

#[derive(Clone, Debug, Default, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize)]
pub struct NumberDecomposeResult {
    pub rest: PackedNumberCounts,
    pub blocks: Vec<Block>,
}

impl NumberDecomposeResult {
    pub fn into_decompose_result(self, t: u8) -> DecomposeResult {
        DecomposeResult {
            rest: {
                let mut counts = Counts::new();
                match t {
                    0 => counts.m = self.rest,
                    1 => counts.p = self.rest,
                    2 => counts.s = self.rest,
                    _ => unreachable!(),
                }
                counts
            },
            blocks: self
                .blocks
                .into_iter()
                .map(|Block { block_type, tile }| Block {
                    block_type,
                    tile: tile + 9 * t,
                })
                .collect(),
        }
    }
}

#[derive(Clone, Debug, Default, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize)]
pub struct DecomposeResult {
    pub rest: Counts,
    pub blocks: Vec<Block>,
}

impl DecomposeResult {
    pub fn shanten(&self, meld: i32) -> i32 {
        let mut kotsu = 0;
        let mut shuntsu = 0;
        let mut ryammen = 0;
        let mut penchan = 0;
        let mut kanchan = 0;
        let mut toitsu = 0;
        for b in &self.blocks {
            match b.block_type {
                BlockType::Kotsu => kotsu += 1,
                BlockType::Shuntsu => shuntsu += 1,
                BlockType::Ryammen => ryammen += 1,
                BlockType::Penchan => penchan += 1,
                BlockType::Kanchan => kanchan += 1,
                BlockType::Toitsu => toitsu += 1,
            }
        }

        let mentsu = kotsu + shuntsu + meld;
        let tatsu_blocks = ryammen + penchan + kanchan + toitsu;
        let tatsu = if mentsu + tatsu_blocks > 4 {
            4 - mentsu
        } else {
            tatsu_blocks
        };
        let has_toitsu = mentsu + tatsu_blocks > 4 && toitsu > 0;

        8 - mentsu * 2 - tatsu - if has_toitsu { 1 } else { 0 }
    }
}
