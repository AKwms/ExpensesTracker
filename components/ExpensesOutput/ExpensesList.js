import { FlatList } from "react-native";
import ExpenseItem from "./ExpenseItem";

function renderExpenseItem(itemData) { //the expense item is passed as an argument (itemData) by the FlatList component.
    return <ExpenseItem  {...itemData.item}/> //the props name in ExpenseItem.js is the same as the keys in the DUMMY_EXPENSES array. so we can use the spread operator to pass the props.
    // you can set the props manually like this: <ExpenseItem description={itemData.item.description} date={itemData.item.date} amount={itemData.item.amount}/>
}

function ExpensesList({expenses}) {
    return <FlatList data={expenses} renderItem={renderExpenseItem} keyExtractor={(item) => item.id}/>
}


export default ExpensesList;