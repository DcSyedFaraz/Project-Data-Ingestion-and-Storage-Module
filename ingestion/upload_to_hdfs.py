import argparse
import os
from hdfs import InsecureClient


def upload(client: InsecureClient, local_path: str, hdfs_dest: str):
    if os.path.isdir(local_path):
        for root, _, files in os.walk(local_path):
            for fname in files:
                full_local = os.path.join(root, fname)
                rel_path = os.path.relpath(full_local, local_path)
                dest_path = os.path.join(hdfs_dest, rel_path)
                print(f"Uploading {full_local} -> {dest_path}")
                client.upload(dest_path, full_local, overwrite=True)
    else:
        print(f"Uploading {local_path} -> {hdfs_dest}")
        client.upload(hdfs_dest, local_path, overwrite=True)


def main():
    parser = argparse.ArgumentParser(description="Upload files to HDFS.")
    parser.add_argument(
        "--namenode",
        required=True,
        help="HDFS namenode URL, e.g. http://namenode:50070",
    )
    parser.add_argument("--user", default="hdfs", help="HDFS user")
    parser.add_argument(
        "--local", required=True, help="Local file or directory to upload"
    )
    parser.add_argument("--dest", required=True, help="Destination path in HDFS")
    args = parser.parse_args()

    client = InsecureClient(args.namenode, user=args.user)
    upload(client, args.local, args.dest)


if __name__ == "__main__":
    main()
