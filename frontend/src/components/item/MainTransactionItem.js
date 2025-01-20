import React from "react";
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
const MainTransactionItem = ({ transaction }) => {
    return (
        <tr>
            <td>
                
                    
                {transaction.transaction_type === "income" ? (
                    <span className="transaction-table-icon blueish-iconer">
                        <TrendingUpRoundedIcon />
                    </span>
                ) : transaction.transaction_type === "expense" ? (
                    
                    <span className="transaction-table-icon reddish-iconer">
                        <TrendingDownRoundedIcon />
                    </span>
                ) : "-"}
            </td>
            <td>{transaction.description || "N/A"}</td>
            <td>{transaction.account_name}</td>
            <td>{transaction.category_name}</td>
            <td>{transaction.amount}</td>
            <td>{new Date(transaction.created_at).toLocaleDateString()}</td>
        </tr>
    );
};

export default MainTransactionItem;
