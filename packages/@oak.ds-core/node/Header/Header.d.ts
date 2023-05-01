import { Component } from "solid-js";
import "./header.css";
type User = {
    name: string;
};
export interface HeaderProps {
    user?: User;
    onLogin: () => void;
    onLogout: () => void;
    onCreateAccount: () => void;
}
declare const Header: Component<HeaderProps>;
export default Header;
//# sourceMappingURL=Header.d.ts.map