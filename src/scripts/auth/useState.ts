interface User {
    email: string,
    firstName: string,
    lastName: string,
    roles: [],
    subscriptionId: string
}

function useState() {
    const user: User = sessionStorage.getItem("user") 
        ? JSON.parse(sessionStorage.getItem("user") as string) 
        : null;
    return user
}

export default useState