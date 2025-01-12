virsh shutdown pterodactylts-test

until virsh list --state-shutoff | grep "pterodactylts-test "; do sleep 1; done

virsh undefine pterodactylts-test --remove-all-storage
