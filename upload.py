import os
import requests
import subprocess

# ================= CONFIG =================
GITHUB_USERNAME = "Mr666-cry"
GITHUB_EMAIL = "codexcraft20@gmail.com"
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
# ==========================================

if not GITHUB_TOKEN:
    print("[!] Token belum diset!")
    print("Gunakan: export GITHUB_TOKEN=token_lo")
    exit()

def run(cmd):
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    
    if result.stdout:
        print(result.stdout)
    if result.stderr:
        print("ERROR:", result.stderr)
        
    return result

def fix_git_safety():
    run("git config --global --add safe.directory '*'")
    run("git config --global init.defaultBranch main")

def create_repo(repo_name):
    url = "https://api.github.com/user/repos"
    headers = {"Authorization": f"token {GITHUB_TOKEN}"}
    data = {"name": repo_name}

    r = requests.post(url, json=data, headers=headers)

    if r.status_code == 201:
        print("[+] Repo berhasil dibuat")
    elif r.status_code == 422:
        print("[!] Repo sudah ada, lanjut...")
    else:
        print("[!] Error create repo:", r.text)

def setup_git(repo_name):
    run("rm -rf .git")  # reset biar bersih (hindari error lama)
    run("git init")

    run(f'git config user.name "{GITHUB_USERNAME}"')
    run(f'git config user.email "{GITHUB_EMAIL}"')

    run("git add .")

    res = run('git commit -m "auto upload"')

    if "nothing to commit" in res.stderr:
        print("[!] Tidak ada perubahan, lanjut...")

    remote = f"https://{GITHUB_TOKEN}@github.com/{GITHUB_USERNAME}/{repo_name}.git"

    run("git remote remove origin")
    run(f"git remote add origin {remote}")

def push_with_fix():
    run("git branch -M main")

    res = run("git push -u origin main")

    if "rejected" in res.stderr:
        print("[!] Push ditolak, fixing...")
        run("git pull origin main --rebase")
        run("git push -u origin main")

    elif "failed to push" in res.stderr:
        print("[!] Force push...")
        run("git push -u origin main --force")

    elif "src refspec main does not match any" in res.stderr:
        print("[!] Branch error, fixing...")
        run("git branch -M main")
        run("git push -u origin main")

    elif "GH013" in res.stderr:
        print("[!] ERROR: Terdeteksi SECRET dalam file!")
        print("Hapus token dari file sebelum push!")

def main():
    fix_git_safety()

    repo_name = os.path.basename(os.getcwd())
    print(f"[+] Repo name: {repo_name}")

    create_repo(repo_name)
    setup_git(repo_name)
    push_with_fix()

if __name__ == "__main__":
    main()