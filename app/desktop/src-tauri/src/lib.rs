use std::{env, fs, path::PathBuf};

const DEFAULT_SKIN: &str = "business";

fn skin_path() -> Option<PathBuf> {
    let home = env::var_os("HOME").or_else(|| env::var_os("USERPROFILE"))?;
    Some(
        PathBuf::from(home)
            .join(".kiro")
            .join("crew")
            .join("apps")
            .join("kiro-desktop-pet")
            .join("data")
            .join("skin.txt"),
    )
}

fn valid_skin(skin: &str) -> bool {
    matches!(skin, "business" | "casual")
}

#[tauri::command]
fn get_skin() -> String {
    let Some(path) = skin_path() else {
        return DEFAULT_SKIN.to_string();
    };
    let Ok(value) = fs::read_to_string(path) else {
        return DEFAULT_SKIN.to_string();
    };
    let skin = value.trim();
    if valid_skin(skin) {
        skin.to_string()
    } else {
        DEFAULT_SKIN.to_string()
    }
}

#[tauri::command]
fn set_skin(skin: String) -> Result<(), String> {
    if !valid_skin(&skin) {
        return Err("skin must be business or casual".to_string());
    }
    let path = skin_path().ok_or_else(|| "home directory is unavailable".to_string())?;
    let parent = path
        .parent()
        .ok_or_else(|| "skin settings directory is unavailable".to_string())?;
    fs::create_dir_all(parent).map_err(|error| error.to_string())?;
    fs::write(path, format!("{skin}\n")).map_err(|error| error.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_skin, set_skin])
        .run(tauri::generate_context!())
        .expect("error while running Kiro Desktop Pet");
}
