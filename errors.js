

const fatalerror = (error) => {return {
	success: false,
	error: error,
}}

const getsuccess = {
	success: true,
	message: "Get request successful",
	data: {
		firstName: "",
		lastName: ""
} 
}

const postsuccess = {
	success: true,
	message: "Post request successful",
	data: {
		firstName: "",
		lastName: ""
} 
}

module.exports = {getsuccess, postsuccess, fatalerror}