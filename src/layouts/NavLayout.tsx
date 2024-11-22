import { Outlet } from 'react-router-dom'

function NavLayout() {
    return (
        <>
            <div>NavLayout</div>
            <Outlet />
        </>
    )
}

export default NavLayout