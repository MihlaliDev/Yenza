import React, {useState} from "react";
import {v4 as uuidv4} from "uuid";
import { DragDropContext, Droppable} from "react-beautiful-dnd";

//Components
import InputContainer from "../components/InputContainer";
import List from "../components/List";


//Utilization of the store
import store from "../utils/store";
import StoreApi from "../utils/storeApi";

//Styles 
import "./styles.scss";

const dataStorage = JSON.parse(window.localStorage.getItem("dataKanban"));

const initialState = () => {
    if (dataStorage) {
        return dataStorage;
    } else {
        window.localStorage.setItem("dataKanban", JSON.stringify(store));
        return store;
    }
};

export default function Home() {
    const [data, setData] = useState(initialState());

    const addTileCard = (title, listId) => {
        if(!title) {
            return;
        }

        const newTileId = uuid();
        const newTile = {
            id: newTileId,
            title,
        };

        const list = data.lists[listId];
        list.cards = [...list.cards, newTile];

        const newState = {
            ...data,
            lists: {
                ...data.lists,
                [listId]: list,
            },
        };
        setData(newState);
        window.localStorage.setItem("dataKanban", JSON.stringify(newState));
    };

    const removeTile = (index, listId) => {
        const list = data.lists[listId];
        list.cards.splice(index, 1);

        const newState = {
            ...data,
            lists: {
                ...data.lists,
                [listId]: list,
            },
        };
        setData(newState);
        window.localStorage.setItem("dataKanban", JSON.stringify(newState));

    };

    const updateTileTitle = (title, index, listId) => {
        const list = data.lists[listId];
        list.cards[index].title = title;
        const newState = {
            ...data,
            lists: {
                ...data.lists,
                [listId]: list,
            },
        };
        setData(newState);
        window.localStorage.setItem("dataKanban", JSON.stringify(newState));
    };

    const addMoreList = (title) => {
        if(!title) {
            return;
        }

        const newListId = uuid();
        const newList = {
            id: newListId,
            title,
            cards: [],
        };
        const newState = {
            listIds: [...data.listIds, newListId],
            lists: {
                ...data.lists,
                [newListId]: newList,
            },
        };
        setData(newState);
        window.localStorage.setItem("dataKanban", JSON.stringify(newState));
    };

    const updateListTitle = (title, listId) => {
        const list = data.lists[listId];
        list.title = title;

        const newState = {
            ...data,
            lists: {
                ...data.lists,
                [listId]: list,
            },
        };
        setData(newState);
        window.localStorage.setItem("dataKanban", JSON.stringify(newState));
    };

    const deleteList = (listId) => {
        const lists = data.lists;
        const listIds = data.listIds;

        delete lists[listId];
        listIds.splice(listIds.indexOf(listId), 1);

        const newState = {
            lists: lists,
            listIds: listIds,
        };
        setData(newState);
        window.localStorage.setItem("dataKanban", JSON.stringify(newState));
    };

    const onDragEnd = (result) => {
        const {destination, source, draggableId, type} = result;

        if(!destination) {
            return;
        }

        if (type === "list") {
            const newListIds = data.listIds;
            newListIds.splice(source.index, 1);
            newListIds.splice(destination.index, 0, draggableId);

            const newState = {
                ...data,
                listIds: newListIds,
            };
            setData(newState);
            window.localStorage.setItem("dataKanban", JSON.stringify(newState));
            return;
        }

        const sourceList = data.lists[source.droppableId];
        const destinationList = data.lists[destination.droppableId];
        const draggingTile = sourceList.cards.filter(
            (card) => card.id === draggableId
        )[0];

        if (source.droppableId === destination.droppableId) {
            sourceList.cards.splice(source.index, 1);
            destinationList.cards.splice(destination.index, 0, draggingTile);

            const newState = {
                ...data,
                lists: {
                    ...data.lists,
                    [sourceList.id]: destinationList,
                },
            };
            setData(newState);
            window.localStorage.setItem("dataKanban", JSON.stringify(newState));
        } else {
            sourceList.cards.splice(source.index, 1);
            destinationList.cards.splice(destination.index, 0, draggingTile);

            const newState = {
                ...data,
                lists: {
                    ...data.lists,
                    [sourceList.id]: sourceList,
                    [destinationList.id]: destinationList,
                },
            };
            setData(newState);
            window.localStorage.setItem("dataKanban", JSON.stringify(newState));
        }
    };

    return (
        <StoreApi.Provider
            value={{
                addTileCard,
                removeTile,
                updateTileTitle,
                addMoreList,
                updateListTitle,
                deleteList,
            }}>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="app" type="list" direction="horizontal">
                    {(provided) => (
                        <div className="wrapper" ref={provided.innerRef}{...provided.droppableProps}>
                            {data.listIds.map((listId, index) => {
                                const list = data.lists[listId];
                                return <List list={list} key={listId} index={index} />;
                            })}
                            <div>
                                <InputContainer type="list" />
                            </div>
                            {provided.placeholder}
                        </div>)}
                </Droppable>
            </DragDropContext>
        </StoreApi.Provider>
    );
}