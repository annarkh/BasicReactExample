import React, {useState, useRef, useEffect} from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';
import data from './data'

const Pos = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
};
const SizeTabel = {
    border: "1px solid #ccc",
    align: "center",
    cellPadding: "20",
    margin: "1em",
    fontSize: "14px",
    width: "500",
};
const SizeStr = {
    border: "1px solid #ddd",
    padding: "5px",
    borderRadius: "3px",
    width: "10%"
};

function TotalAmount(props) {
    return <div>
        <div>{props.total}</div>
        <button>В корзину</button>
    </div>
}

function Str(props) {
    let [count, setCount] = useState(0);
    let {handleChange} = props;
    let {gid, gname, gprice} = props.tableData;
    let subSum = gprice * count;
    return <tr>
        <td style={SizeStr}>{gid}</td>
        <td style={SizeStr}>{gname}</td>
        <td style={SizeStr}>{gprice}</td>
        <td style={SizeStr}><input type="number"
                                   min="0"
                                   value={count}
                                   onChange={(event) => {
                                       setCount(+event.target.value);
                                       handleChange(gid, +event.target.value, gprice * event.target.value);
                                   }}/></td>
        <td style={SizeStr}>{subSum}</td>
    </tr>
}

function Table(props) {
    let {tableData, handleChange} = props;
    return <table style={SizeTabel}>
        <thead>
        <tr>
            <th colSpan={5}>{tableData.rname}</th>
        </tr>
        </thead>
        <tbody>
        {
            tableData.goods.map((it, j) => {
                return <Str key={j} tableData={it} handleChange={handleChange}/>
            })
        }
        </tbody>
    </table>;
}

function App() {
    let [categories, setCategories] = useState([]);
    let [counts, setCounts] = useState({});
    let updateCount = (id, count, price) => {
        setCounts(prevCounts => ({...prevCounts, [id]: [count, price]}))
    };
    let totalSum = 0;
    for (let key in counts) {
        totalSum += counts[key][1];
    }

    useEffect(() => {
        axios.get(`https://datainlife.ru/junior_task/get_products.php`)
            .then(res => {
                let cats = [];
                res.data.map((item, i) => {
                    if (item.goods !== undefined) {
                        cats.push(<Table tableData={item} key={i} handleChange={updateCount}/>)
                    }
                })
                setCategories([...cats]);
            })
    }, []);

    return (
        <div className="App">
            <div style={Pos}>
                {
                    categories.map((item) => {
                        return item
                    })
                }
            </div>
            <div>
                <TotalAmount total={totalSum}/>
                {totalSum}
            </div>
        </div>
    );

}

export default App;
