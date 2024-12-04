use std::fs::File;
use std::io::{BufWriter, Write};

use cosmwasm_std::Binary;
use noise::utils::{NoiseMap, NoiseMapBuilder, PlaneMapBuilder};
use noise::{Fbm, Perlin};
use serde_json::json;

pub fn generate_map(seed: u32, output: &str) -> anyhow::Result<()> {
    let fbm = Fbm::<Perlin>::new(seed);

    let noise_map = PlaneMapBuilder::<_, 3>::new(&fbm)
        .set_size(1000, 1000)
        .set_x_bounds(-5.0, 5.0)
        .set_y_bounds(-5.0, 5.0)
        .build();

    let data = write_to_vec(&noise_map);
    let (width, height) = noise_map.size();

    let json_data = json! ({
        "width": width,
        "height": height,
        "data": Binary::new(data).to_base64()
    });

    let file = File::create(output)?;
    let mut writer = BufWriter::new(file);
    serde_json::to_writer(&mut writer, &json_data)?;
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
