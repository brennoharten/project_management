function getInitials(str) {
    return str
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase())
        .join("");
}

export default getInitials