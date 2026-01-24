Delete Operation in MongoDB

    Property:
        ->  We cannot delete/Update _id
        -> db.expenses.updateOne({ title: "Grocery" }, {$unset: { value: "" }});
            It will delete the value property from that document

    Document:
        -> db.expenses.deleteOne({ title: "Grocery" });
            It will find the document and delete it

    Collection:
        -> db.<collectionName>.drop()
            It will delete the collection

    Database:
        -> for deleting we should be in the database.
        -> db.dropDatabase()
            It will delete all the collections, document inside the DB.