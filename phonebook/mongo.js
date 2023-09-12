const mongoose = require('mongoose')

if (process.argv.length < 3 || process.argv.length > 5) {
    console.log('To fetch data put your password only in as an argument. \nTo enter data, put the "name" & number also.')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://dermotbg:${password}@fscluster0.nb6snmv.mongodb.net/phoneBook?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const entrySchema = mongoose.Schema({
    name: String,
    number: String,
})
const Entry = mongoose.model('Entry', entrySchema)

if (process.argv.length > 3 ) {
    
    const entry = new Entry ({
        name: process.argv[3],
        number: process.argv[4],
    })
    
    entry.save().then(result =>{
        console.log(`added ${result.name}, number: ${result.number} to phonebook`)
        mongoose.connection.close()
    })

} 
else if(process.argv.length === 3) {
    Entry.find({}).then(result => {
        console.log('Phonebook:')
        result.forEach(entry =>{
            console.log(`${entry.name} ${entry.number}`)
        })
        mongoose.connection.close()
    })
}