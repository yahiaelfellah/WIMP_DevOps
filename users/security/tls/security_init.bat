@REM @echo off

@REM :: Generate private key
@REM ssh-keygen -t rsa -b 4096 -m PEM -f private.key -E SHA512

@REM echo Private and public keys generated successfully.

@echo off

:: Specify the target folder where you want to copy the keys
set "target_folder=../../../gateway/security/tls"

:: Generate private key
ssh-keygen -t rsa -b 4096 -m PEM -f private.key -E SHA512

:: Copy the keys to the target folder
copy private.key "%target_folder%"
copy private.key.pub "%target_folder%"

echo Private and public keys generated and copied to "%target_folder%" successfully.
