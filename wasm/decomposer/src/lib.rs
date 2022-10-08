mod counts;
mod data;
mod decomposer;
mod shanten;

use shanten::decompose_min_shanten;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn decompose_from_counts(counts: &[u8], meld: i32) -> JsValue {
    let results = decompose_min_shanten(counts, meld);
    serde_wasm_bindgen::to_value(&results).unwrap_or(JsValue::NULL)
}
