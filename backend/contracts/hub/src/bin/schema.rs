use cosmwasm_schema::remove_schemas;
use std::env::current_dir;
use std::fs::create_dir_all;
use xion_adventures_hub::contract::Hub;

fn main() {
    let mut out_dir = current_dir().unwrap();
    out_dir.push("schema");
    create_dir_all(&out_dir).unwrap();
    remove_schemas(&out_dir).unwrap();

    Hub::export_schema(&out_dir);
}
