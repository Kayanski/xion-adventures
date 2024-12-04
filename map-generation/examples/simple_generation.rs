use map_generation::generate_map;

fn main() -> anyhow::Result<()> {
    generate_map(56, "../public/mapTest.json")?;
    Ok(())
}
