use std::fs::File;
use std::io::{BufWriter, Write};

use common::MapOutput;
use cosmwasm_std::Binary;
use noise::utils::{NoiseMap, NoiseMapBuilder, PlaneMapBuilder};
use noise::{Fbm, Perlin};

pub fn generate_map(seed: u32, size: u32) -> MapOutput {
    let fbm = Fbm::<Perlin>::new(seed);

    let noise_map = PlaneMapBuilder::<_, 3>::new(&fbm)
        .set_size(size as usize, size as usize)
        .set_x_bounds(-5.0, 5.0)
        .set_y_bounds(-5.0, 5.0)
        .build();

    let data = write_to_vec(&noise_map);

    MapOutput {
        width: size,
        height: size,
        data: Binary::new(data),
    }
}

pub fn generate_map_to_file(seed: u32, size: u32, file: &str) -> anyhow::Result<()> {
    let map = generate_map(seed, size);
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
