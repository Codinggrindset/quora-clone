

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

const registererrhandler = (error) =>{
	
if(error.message.includes('Module validation failed')){
	return Object.values(error.errors)[0].properties.message
}
else {
	if(error.code == 11000){
		return 'Email is already registered'
	}
	else {
		return
	}
}
}

module.exports = {getsuccess, postsuccess, fatalerror, registererrhandler}