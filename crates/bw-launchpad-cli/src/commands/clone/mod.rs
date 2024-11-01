use crate::context::Context;

pub fn clone(context: &Context) {
    clone_repository(
        context,
        "clients",
        &context.config.repositories.clients.git_url,
        &context.config.repositories.clients.path,
    );

    clone_repository(
        context,
        "server",
        &context.config.repositories.server.git_url,
        &context.config.repositories.server.path,
    );

    clone_repository(
        context,
        "sdk",
        &context.config.repositories.sdk.git_url,
        &context.config.repositories.sdk.path,
    );
}

fn clone_repository(context: &Context, name: &str, url: &String, path: &String) {
    if should_clone(name, path) {
        cliclack::log::info(format!("Cloning {name}...")).expect("Encountered I/O Error");
        context
            .shell
            .run_inline_shell_command(format!("git clone {} {}", url, path));
    }
}

fn should_clone(name: &str, path: &String) -> bool {
    let path_exists = std::path::Path::new(&path).exists();

    if path_exists {
        cliclack::log::warning(format!("Found existing {name} repository."))
            .expect("Encountered I/O Error");
        let should_delete = cliclack::select(format!("Initializing a new {name} repository will delete the existing one. Are you sure you want to proceed?"))
            .item(false, "Use as-is", "")
            .item(true, "Delete", "")
            .interact()
            .expect("Encountered I/O Error");

        let should_delete = if should_delete {
            cliclack::confirm(format!(
                "Are you sure you want to delete the existing {name} repository?"
            ))
            .initial_value(false)
            .interact()
            .expect("Encountered I/O Error")
        } else {
            false
        };

        if should_delete {
            std::fs::remove_dir_all(&path).expect("Failed to delete directory");
            cliclack::log::success(format!("Deleted existing {name} repository."))
                .expect("Encountered I/O Error");
            return true;
        }

        cliclack::log::info(format!("Using existing {name} repository as-is."))
            .expect("Encountered I/O Error");
        return false;
    }

    return true;
}
