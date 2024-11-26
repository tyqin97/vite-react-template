import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';

export default function MatrixVisualizer({ matrix }) {
    return (
        <div
            style={{
                overflowX: 'auto',  // Allows horizontal scrolling if the table exceeds width
                overflowY: 'auto',
                maxHeight: '400px',
                padding: '20px',    // Optional: Adds some spacing around the table
                maxWidth: '100%',   // Ensures the parent div doesn't exceed the width of the container
        }}>
            <Table style={{
                    borderCollapse: 'collapse',
                    tableLayout: 'auto',  // Automatically adjusts column width based on content
                    width: '100%',         // Ensures the table takes up the full width of the parent container
            }}>
                <Tbody>
                {matrix.map((row, rowIndex) => (
                    <Tr key={rowIndex}>
                    {row.map((cell, colIndex) => (
                        <Td
                        key={colIndex}
                        style={{
                            padding: '10px',
                            textAlign: 'center',
                            border: '1px solid #ddd',
                            backgroundColor: '#ccc',
                        }}
                        >
                        {cell.toFixed(4)} {/* Displaying each value rounded to 2 decimal places */}
                        </Td>
                    ))}
                    </Tr>
                ))}
                </Tbody>
            </Table>
        </div>
        
    )
}