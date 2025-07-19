import { InterfaceProvider } from './InterfaceContext';

const AdminProvider = ({ children }) => {
    return (
        <InterfaceProvider>
            {children}
        </InterfaceProvider>
    )
}

export default AdminProvider