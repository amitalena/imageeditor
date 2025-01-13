import { Outlet } from 'react-router-dom'
function MainLayout() {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Outlet />
        </div>
    )
}

export default MainLayout