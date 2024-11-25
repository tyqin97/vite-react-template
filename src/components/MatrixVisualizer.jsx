

export default function MatrixVisualizer({ matrix }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px', overflow: 'auto'}}>
        <table style={{ borderCollapse: 'collapse' }}>
            <tbody>
            {matrix.map((row, rowIndex) => (
                <tr key={rowIndex}>
                {row.map((cell, colIndex) => (
                    <td
                    key={colIndex}
                    style={{
                        padding: '10px',
                        border: '1px solid #ddd',
                        textAlign: 'center',
                        backgroundColor: '#f4f4f4',
                    }}
                    >
                    {cell.toFixed(4)} {/* Displaying each value rounded to 2 decimal places */}
                    </td>
                ))}
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    )
}