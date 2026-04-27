import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableCol,
  TableColGroup,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '../table';

const meta = {
  title: 'Atoms/Table',
  component: Table,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

const invoices = [
  { invoice: 'INV001', status: '결제완료', method: '신용카드', amount: '250,000원' },
  { invoice: 'INV002', status: '대기중', method: '계좌이체', amount: '150,000원' },
  { invoice: 'INV003', status: '결제완료', method: '신용카드', amount: '350,000원' },
  { invoice: 'INV004', status: '결제완료', method: '페이팔', amount: '450,000원' },
  { invoice: 'INV005', status: '취소', method: '신용카드', amount: '550,000원' },
];

export const Default: Story = {
  render: () => (
    <Table className="w-[600px]">
      <TableHeader>
        <TableRow>
          <TableHead>청구서</TableHead>
          <TableHead>상태</TableHead>
          <TableHead>결제방법</TableHead>
          <TableHead>금액</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.invoice}>
            <TableCell>{invoice.invoice}</TableCell>
            <TableCell>{invoice.status}</TableCell>
            <TableCell>{invoice.method}</TableCell>
            <TableCell>{invoice.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const SmallRows: Story = {
  render: () => (
    <Table className="w-[600px]" rowSize="sm">
      <TableHeader>
        <TableRow>
          <TableHead>청구서</TableHead>
          <TableHead>상태</TableHead>
          <TableHead>결제방법</TableHead>
          <TableHead>금액</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.invoice}>
            <TableCell>{invoice.invoice}</TableCell>
            <TableCell>{invoice.status}</TableCell>
            <TableCell>{invoice.method}</TableCell>
            <TableCell>{invoice.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const MediumRows: Story = {
  render: () => (
    <Table className="w-[600px]" rowSize="md">
      <TableHeader>
        <TableRow>
          <TableHead>청구서</TableHead>
          <TableHead>상태</TableHead>
          <TableHead>결제방법</TableHead>
          <TableHead>금액</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.invoice}>
            <TableCell>{invoice.invoice}</TableCell>
            <TableCell>{invoice.status}</TableCell>
            <TableCell>{invoice.method}</TableCell>
            <TableCell>{invoice.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const LargeRows: Story = {
  render: () => (
    <Table className="w-[600px]" rowSize="lg">
      <TableHeader>
        <TableRow>
          <TableHead>청구서</TableHead>
          <TableHead>상태</TableHead>
          <TableHead>결제방법</TableHead>
          <TableHead>금액</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.invoice}>
            <TableCell>{invoice.invoice}</TableCell>
            <TableCell>{invoice.status}</TableCell>
            <TableCell>{invoice.method}</TableCell>
            <TableCell>{invoice.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const WithCaption: Story = {
  render: () => (
    <Table className="w-[600px]">
      <TableCaption>최근 청구서 목록</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>청구서</TableHead>
          <TableHead>상태</TableHead>
          <TableHead>결제방법</TableHead>
          <TableHead>금액</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.slice(0, 3).map((invoice) => (
          <TableRow key={invoice.invoice}>
            <TableCell>{invoice.invoice}</TableCell>
            <TableCell>{invoice.status}</TableCell>
            <TableCell>{invoice.method}</TableCell>
            <TableCell>{invoice.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Table className="w-[600px]">
      <TableHeader>
        <TableRow>
          <TableHead>청구서</TableHead>
          <TableHead>상태</TableHead>
          <TableHead>결제방법</TableHead>
          <TableHead>금액</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.invoice}>
            <TableCell>{invoice.invoice}</TableCell>
            <TableCell>{invoice.status}</TableCell>
            <TableCell>{invoice.method}</TableCell>
            <TableCell>{invoice.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>합계</TableCell>
          <TableCell>1,750,000원</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};

export const WithColGroup: Story = {
  render: () => (
    <Table className="w-[600px]">
      <TableColGroup>
        <TableCol style={{ width: '20%' }} />
        <TableCol style={{ width: '25%' }} />
        <TableCol style={{ width: '30%' }} />
        <TableCol style={{ width: '25%' }} />
      </TableColGroup>
      <TableHeader>
        <TableRow>
          <TableHead>청구서</TableHead>
          <TableHead>상태</TableHead>
          <TableHead>결제방법</TableHead>
          <TableHead>금액</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.invoice}>
            <TableCell>{invoice.invoice}</TableCell>
            <TableCell>{invoice.status}</TableCell>
            <TableCell>{invoice.method}</TableCell>
            <TableCell>{invoice.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const Scrollable: Story = {
  render: () => {
    const extendedInvoices = [...invoices, ...invoices, ...invoices].map((inv, idx) => ({
      ...inv,
      invoice: `${inv.invoice}-${idx}`,
    }));

    return (
      <Table className="w-[600px]" scrollable maxHeight={200}>
        <TableHeader>
          <TableRow>
            <TableHead>청구서</TableHead>
            <TableHead>상태</TableHead>
            <TableHead>결제방법</TableHead>
            <TableHead>금액</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {extendedInvoices.map((invoice) => (
            <TableRow key={invoice.invoice}>
              <TableCell>{invoice.invoice}</TableCell>
              <TableCell>{invoice.status}</TableCell>
              <TableCell>{invoice.method}</TableCell>
              <TableCell>{invoice.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  },
};
