#!/bin/bash


# Specify the relative target folder where you want to copy the keys
target_folder="../../../gateway/security/tls"


# Generate public key from private key
ssh-keygen -t rsa -b 4096 -m PEM -f private.key -E SHA512

echo "Private and public keys generated successfully."

# Copy the keys to the target folder
cp private.key "$target_folder"
cp private.key.pub "$target_folder"

echo "Private and public keys generated and copied to $target_folder successfully."