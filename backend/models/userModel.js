const mongoose  = require("mongoose")
const bcrypt=require("bcryptjs")

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    pic: {
      type: String,
      default:
        "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?size=626&ext=jpg&ga=GA1.1.2062043742.1726912969&semt=ais_hybrid",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword=async function(enteredpassword)
{
  return await bcrypt.compare(enteredpassword,this.password);
}

userSchema.pre('save',async function(next)
{
  if(!this.isModified)
  {
    next()
  }
  const salt=await bcrypt.genSalt(10);
  this.password=await bcrypt.hash(this.password,salt);
})

const User=mongoose.model("User",userSchema);
module.exports=User;