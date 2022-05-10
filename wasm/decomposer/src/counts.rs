use std::ops::Add;

use serde::{Serialize, Serializer};

#[derive(Clone, Copy, Debug, Default, Eq, Hash, Ord, PartialEq, PartialOrd)]
pub struct PackedCounts<const N: usize>(u32);

impl<const N: usize> PackedCounts<N> {
    pub fn with(counts: &[u8]) -> Self {
        if counts.len() != N {
            panic!();
        }
        let mut d = 0;
        for i in 0..N {
            d |= (counts[i] as u32 & 0b111) << (3 * i);
        }
        Self(d)
    }

    pub fn get(&self, index: usize) -> u8 {
        ((self.0 >> (3 * index)) & 0b111) as u8
    }

    pub fn set(&mut self, index: usize, value: u8) {
        self.0 = (self.0 & !(0b111 << (3 * index))) | ((value as u32 & 0b111) << (3 * index));
    }

    pub fn set_by(&mut self, index: usize, f: impl FnOnce(u8) -> u8) {
        self.set(index, f(self.get(index)))
    }

    pub fn iter(&self) -> PackedCountsIterator<N> {
        PackedCountsIterator::new(self)
    }
}

impl<const N: usize> Add for PackedCounts<N> {
    type Output = Self;

    fn add(self, rhs: Self) -> Self::Output {
        let a: Vec<_> = self.iter().zip(rhs.iter()).map(|(a, b)| a + b).collect();
        Self::with(&a)
    }
}

impl<const N: usize> Serialize for PackedCounts<N> {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        serializer.collect_seq(self.iter())
    }
}

pub struct PackedCountsIterator<'a, const N: usize> {
    source: &'a PackedCounts<N>,
    index: usize,
}

impl<'a, const N: usize> PackedCountsIterator<'a, N> {
    fn new(source: &'a PackedCounts<N>) -> Self {
        Self { source, index: 0 }
    }
}

impl<const N: usize> Iterator for PackedCountsIterator<'_, N> {
    type Item = u8;

    fn next(&mut self) -> Option<Self::Item> {
        if self.index == N {
            None
        } else {
            let value = self.source.get(self.index);
            self.index += 1;
            Some(value)
        }
    }
}

pub type PackedNumberCounts = PackedCounts<9>;
pub type PackedCharacterCounts = PackedCounts<7>;

#[derive(Clone, Copy, Debug, Default, Eq, Hash, Ord, PartialEq, PartialOrd)]
pub struct Counts {
    pub m: PackedNumberCounts,
    pub p: PackedNumberCounts,
    pub s: PackedNumberCounts,
    pub z: PackedCharacterCounts,
}

impl Counts {
    pub fn new() -> Self {
        Default::default()
    }

    pub fn with(counts: &[u8]) -> Self {
        if counts.len() != 34 {
            panic!();
        }
        Self {
            m: PackedNumberCounts::with(&counts[0..9]),
            p: PackedNumberCounts::with(&counts[9..18]),
            s: PackedNumberCounts::with(&counts[18..27]),
            z: PackedCharacterCounts::with(&counts[27..34]),
        }
    }
}

impl Add for Counts {
    type Output = Self;

    fn add(self, rhs: Self) -> Self::Output {
        Self {
            m: self.m + rhs.m,
            p: self.p + rhs.p,
            s: self.s + rhs.s,
            z: self.z + rhs.z,
        }
    }
}

impl Serialize for Counts {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        serializer.collect_seq(
            self.m
                .iter()
                .chain(self.p.iter())
                .chain(self.s.iter())
                .chain(self.z.iter()),
        )
    }
}
