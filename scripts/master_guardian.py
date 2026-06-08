import os

def main():
    print("=== DEBUG: Checking Moz Secrets ===")

    moz_access_id = os.environ.get("MOZ_ACCESS_ID")
    moz_secret_key = os.environ.get("MOZ_SECRET_KEY")

    if moz_access_id:
        print("✓ MOZ_ACCESS_ID found")
    else:
        print("✗ MOZ_ACCESS_ID NOT found")

    if moz_secret_key:
        print("✓ MOZ_SECRET_KEY found")
    else:
        print("✗ MOZ_SECRET_KEY NOT found")

    print("=== END DEBUG ===")

if __name__ == "__main__":
    main()
