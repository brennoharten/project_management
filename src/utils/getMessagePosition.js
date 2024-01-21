const getMessagePosition = (author, userUid) => {
	if (author === userUid) {
		return "ml-auto bg-primary/90";
	} else {
		return "mr-auto bg-foreground/90";
	}
};

export default getMessagePosition;
