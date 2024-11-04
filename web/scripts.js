function ExistsSession() {
    let userData = (localStorage.getItem("userData") ? localStorage.getItem("userData") : null);
    return (userData !== null);
}

function LoadFirstPage() {
    if (ExistsSession()) {
        window.location.replace("/hotels");
    }
}

function CheckSession() {
    if (!ExistsSession()) {
        window.location.replace("/");
    }
}
