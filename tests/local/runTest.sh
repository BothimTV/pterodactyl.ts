bash ./tests/local/resetVm.sh
export VM_IP=$(virsh net-dhcp-leases default | grep debian | grep -o '[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}')
pnpm test