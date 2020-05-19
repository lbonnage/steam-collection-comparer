import React, {useState} from 'react';
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";

export default function Compare(props) {

    const [newCollection, setNewCollection] = useState('');
    const [collections, setCollections] = useState([]);
    const [collectionList, setCollectionList] = useState([]);

    /**
     * Adds a collection the the list for comparing.
     */
    function AddCollection(newID) {

        if (collections.indexOf(newID) != -1) {
            console.log("Error: Can't add the same collection more than once.")
            return;
        }

        setCollections([...collections, newID])

        setCollectionList([...collectionList, <ListGroup.Item key={newID}>{newID}</ListGroup.Item>]);

    }


    return (
        <div>
            <header>
                <p>
                    Enter the ID to a Steam Workshop Collection to add it to the list.  Press 'Compare' when ready to compare them.
                </p>
            </header>
            <InputGroup className="mb-3">
                <InputGroup.Prepend>
                    <InputGroup.Text id="basic-addon3">
                        https://steamcommunity.com/sharedfiles/filedetails/?id=
                    </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl id="basic-url" aria-describedby="basic-addon3" onChange={e => setNewCollection(e.target.value)}/>
                <InputGroup.Append>
                    <Button variant="outline-secondary" onClick={e => AddCollection(newCollection)}>Add Collection</Button>
                </InputGroup.Append>
            </InputGroup>
            <Form>
                <Button variant="primary" onClick={e => props.compare(collections)}>
                    Compare
                </Button>
            </Form>
            <ListGroup>
                {collectionList}
                {/*{collections.map(c => <ListGroup.Item key={c}>{c}</ListGroup.Item>)}*/}
            </ListGroup>
        </div>
    )

}