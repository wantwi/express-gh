//count 
db.getCollection("persons").find({}).count()

//get all document
db.getCollection("persons").find({})

//equality query
//where name = Grace Larson
db.getCollection("persons").find({ "name" : "Grace Larson"})

//where gender = female and age = 40
db.getCollection("persons").find({ gender:'female',age:40})


//COMPARISON OPERATORS**********************
db.getCollection("persons").find({"eyeColor": {"$ne":'red'}})
db.getCollection("persons").find({"age": {"$gte":30,"$lte":32}})

db.getCollection("persons")
.find({"age": {"$gte":35},"favoriteFruit":{"$ne":"banana"}})
.count()


db.getCollection("persons")
.find({"eyeColor":{"$in":["green"]},"favoriteFruit":{"$in":["strawberry"]}})

db.getCollection("persons")
.find({$and:[{"eyeColor":"green"},{"gender":"male"}]})
.count()


db.getCollection("persons")
.find({$and:[{"age":{"$ne":25}},{"age":{"$gte":25}}]})
.sort({age:1}).count()

//not equal to above
db.getCollection("persons")
.find({"age":{"$ne":25},"age":{"$gte":25}})
.count()