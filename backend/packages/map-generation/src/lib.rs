use std::fs::File;
use std::io::{BufWriter, Write};

use cosmwasm_schema::cw_serde;
use cosmwasm_std::Binary;
use noise::utils::{NoiseMap, NoiseMapBuilder, PlaneMapBuilder};
use noise::{Fbm, Perlin};

#[cw_serde]
pub struct MapOutput {
    pub width: u64,
    pub height: u64,
    pub data: Binary,
}

pub fn generate_map(seed: u32) -> MapOutput {
    let fbm = Fbm::<Perlin>::new(seed);

    let noise_map = PlaneMapBuilder::<_, 3>::new(&fbm)
        .set_size(1000, 1000)
        .set_x_bounds(-5.0, 5.0)
        .set_y_bounds(-5.0, 5.0)
        .build();

    let data = write_to_vec(&noise_map);
    let (width, height) = noise_map.size();

    MapOutput {
        width: width as u64,
        height: height as u64,
        data: Binary::new(data),
    }
}

pub fn generate_map_to_file(seed: u32, file: &str) -> anyhow::Result<()> {
    let map = generate_map(seed);
    let file = File::create(file)?;
    let mut writer = BufWriter::new(file);
    serde_json::to_writer(&mut writer, &map)?;
    writer.flush()?;

    Ok(())
}

pub fn write_to_vec(noise_map: &NoiseMap) -> Vec<u8> {
    let (width, height) = noise_map.size();
    let mut pixels: Vec<u8> = Vec::with_capacity(width * height);

    for i in noise_map.iter() {
        pixels.push(((i * 0.5 + 0.5).clamp(0.0, 1.0) * 255.0) as u8);
    }
    pixels
}
