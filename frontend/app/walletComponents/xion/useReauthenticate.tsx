import { useAbstraxionSigningClient, useModal } from "@burnt-labs/abstraxion";
import { useMemo } from "react";
import { useAbstraxionProviderConfig } from "./useAbstractxionProviderConfig";

export function useReauthenticate() {
    const { contracts, setContracts } = useAbstraxionProviderConfig();
    const { logout } = useAbstraxionSigningClient();
    const [, setShowModal] = useModal();

    const reauthenticate = useMemo(() => {
        if (!logout) return;
        return () => {
            console.log("reauth!!!");
            logout();
            // set contracts again so that prevContracts is set
            setContracts(contracts);
            setShowModal(true);
        };
    }, [logout, setShowModal, setContracts, contracts]);

    return reauthenticate;
}