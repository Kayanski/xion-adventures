use map_generation::generate_map_to_file;

fn main() -> anyhow::Result<()> {
    generate_map_to_file(56, "../public/mapTest.json")?;
    Ok(())
}