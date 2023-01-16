"use strict";
const path = require("path");
const escpos = require("escpos");
escpos.USB = require("escpos-usb");

const device = new escpos.USB();
const options = { encoding: "GB18030" };
const printer = new escpos.Printer(device, options);

var bodyParser = require("body-parser");
var app = require("express")();
var http = require("http").Server(app);
var cors = require("cors");
app.use(cors());
app.use(bodyParser.json());

const port = 4000;

app.post("/printStruck", (req, res) => {
  res.json({ status: "success" });
  // console.log(req.body);
  // console.log(device);
  let response = req.body;
  // console.log(response);
  printStruck(
    response.carts,
    response.subTotal,
    response.pajak,
    response.diskon,
    response.total,
    response.bayar,
    response.kembalian,
    response.tanggal,
    response.noTransaksi,
    response.kasir,
    response.customer
  );
});

http.listen(port, () => {
  console.log(`Printer: http://localhost:${port}`);
  // console.log(escpos.USB());
});

const convertToRupiah = (number, currency = "Rp. ") => {
  if (number) {
    var rupiah = "";
    var numberrev = number.toString().split("").reverse().join("");
    for (var i = 0; i < numberrev.length; i++)
      if (i % 3 == 0) rupiah += numberrev.substr(i, 3) + ".";
    return (
      currency +
      rupiah
        .split("", rupiah.length - 1)
        .reverse()
        .join("")
    );
  } else {
    return currency + number;
  }
};

const printStruck = (
  carts,
  subTotal,
  pajak,
  diskon,
  total,
  bayar,
  kembalian,
  tanggal,
  noTransaksi,
  kasir,
  customer
) => {
  device.open(function () {
    printer
      .font("B")
      .align("CT")
      .style("B")
      .size(1.5, 1.5)
      .text("ALIN POS")
      .newLine()
      .style("NORMAL")
      .size(0.5, 0.5)
      .text("Gg. Dipangga IX, Rajabasa, Kec. Rajabasa, Kota Bandar Lampung")
      .text("085366125569")
      .style("NORMAL")
      .size(0.5, 0.5)
      .drawLine()
      .style("NORMAL")
      .size(0.05, 0.05)
      .tableCustom([
        { text: "Tanggal", align: "LEFT", width: 0.3, style: "NORMAL" },
        { text: ":", align: "LEFT", width: 0.1, style: "NORMAL" },
        {
          text: tanggal,
          align: "LEFT",
          width: 0.3,
          style: "NORMAL",
        },
      ])
      .tableCustom([
        { text: "Nomor Transaksi", align: "LEFT", width: 0.3, style: "NORMAL" },
        { text: ":", align: "LEFT", width: 0.1, style: "NORMAL" },
        { text: noTransaksi, align: "LEFT", width: 0.3, style: "NORMAL" },
      ])
      .tableCustom([
        { text: "Customer", align: "LEFT", width: 0.3, style: "NORMAL" },
        { text: ":", align: "LEFT", width: 0.1, style: "NORMAL" },
        { text: kasir, align: "LEFT", width: 0.3, style: "NORMAL" },
      ])
      .tableCustom([
        { text: "Kasir", align: "LEFT", width: 0.3, style: "NORMAL" },
        { text: ":", align: "LEFT", width: 0.1, style: "NORMAL" },
        { text: customer, align: "LEFT", width: 0.3, style: "NORMAL" },
      ])
      .style("NORMAL")
      .size(0.5, 0.5)
      .drawLine()
      .style("NORMAL")
      .size(0.05, 0.05)
      .tableCustom([
        { text: "QTY", align: "LEFT", width: 0.1, style: "NORMAL" },
        { text: "Produk/Item", align: "LEFT", width: 0.3, style: "NORMAL" },
        { text: "HARGA", align: "RIGHT", width: 0.3, style: "NORMAL" },
        { text: "SUB TOTAL", align: "RIGHT", width: 0.3, style: "NORMAL" },
      ])
      .drawLine();
    carts.forEach((item, index, arr) => {
      printer.tableCustom([
        {
          text: "x" + item.qty,
          align: "LEFT",
          width: 0.1,
          style: "NORMAL",
        },
        { text: item.name, align: "LEFT", width: 0.3, style: "NORMAL" },
        {
          text: convertToRupiah(item.price, ""),
          align: "RIGHT",
          width: 0.3,
          style: "NORMAL",
        },
        {
          text: convertToRupiah(item.price * item.qty, ""),
          align: "RIGHT",
          width: 0.3,
          style: "NORMAL",
        },
      ]);
    });
    printer
      .drawLine()
      .tableCustom([
        { text: "Sub Total", align: "LEFT", width: 0.5, style: "NORMAL" },
        { text: subTotal, align: "RIGHT", width: 0.5, style: "NORMAL" },
      ])
      .tableCustom([
        { text: "Pajak", align: "LEFT", width: 0.5, style: "NORMAL" },
        { text: pajak, align: "RIGHT", width: 0.5, style: "NORMAL" },
      ])
      .tableCustom([
        { text: "Diskon", align: "LEFT", width: 0.5, style: "NORMAL" },
        { text: diskon, align: "RIGHT", width: 0.5, style: "NORMAL" },
      ])
      .tableCustom([
        { text: "Total", align: "LEFT", width: 0.5, style: "NORMAL" },
        { text: total, align: "RIGHT", width: 0.5, style: "NORMAL" },
      ])
      .tableCustom([
        { text: "Bayar", align: "LEFT", width: 0.5, style: "NORMAL" },
        { text: bayar, align: "RIGHT", width: 0.5, style: "NORMAL" },
      ])
      .tableCustom([
        { text: "Kembali", align: "LEFT", width: 0.5, style: "NORMAL" },
        { text: kembalian, align: "RIGHT", width: 0.5, style: "NORMAL" },
      ])
      .drawLine()
      .newLine()
      .style("NORMAL")
      .size(0.5, 0.5)
      .text("Barang yang telah di beli tidak dapat ditukar/dikembalikan")
      .newLine()
      .style("BU")
      .size(0.5, 0.5)
      .text("Terima Kasih atas Kunjungan Anda :)")
      .newLine()
      .style("NORMAL")
      .size(0.5, 0.5)
      .text("Created by : ALIN POS pada " + tanggal)
      .newLine()
      .newLine()
      .marginBottom(15)
      .cut()
      .close();
  });
};
