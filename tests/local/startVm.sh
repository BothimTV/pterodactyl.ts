virt-clone --original pterodactylts-test-base --name pterodactylts-test --auto-clone

virsh start pterodactylts-test

until virsh net-dhcp-leases default | grep debian | grep -o '[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}'; do sleep 1; done

export VM_IP=$(virsh net-dhcp-leases default | grep debian | grep -o '[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}')
