$(document).ready(function () {
    /*** REGION 1 - Global variables - Vùng khai báo biến, hằng số, tham số TOÀN CỤC */
    var gSelectedMenuStructure = {
        menuName: "",    // S, M, L
        duongKinhCM: 0,
        suonNuong: 0,
        saladGr: 0,
        drink: 0,
        priceVND: 0
    };
    var gUser = {
        name: "",
        email: "",
        phone: "",
        address: "",
        voucher: "",
        message: ""
    };
    var gSelectedPizzaType = "";
    var gVoucher;
    var gThanhTien;

    /*** REGION 2 - Vùng gán / thực thi hàm xử lý sự kiện cho các elements */
    onPageLoading();
    $("#btn-small").on("click", function () {
        onBtnSmallClick();
    });
    $("#btn-medium").on("click", function () {
        onBtnMediumClick();
    });
    $("#btn-large").on("click", function () {
        onBtnLargeClick();
    });
    $("#btn-send").on("click", function () {
        onBtnSendClick();
    });
    $("#btn-seafood").on("click", function () {
        onBtnSeaFoodClick();
    });
    $("#btn-hawaii").on("click", function () {
        onBtnHawaiiClick();
    });
    $("#btn-bacon").on("click", function () {
        onBtnBaconClick();
    });
    $("#btn-accept").on("click", function () {
        onBtnAcceptClick();
    });
    $("#btn-cancel").on("click", function () {
        $("#detail-modal").modal("hide");
    })
    /*** REGION 3 - Event handlers - Vùng khai báo các hàm xử lý sự kiện */
    // hàm tải lại trang
    function onPageLoading() {
        $.ajax({
            url: "http://42.115.221.44:8080/devcamp-pizza365/drinks",
            type: "GET",
            async: false,
            success: function (Response) {
                console.log(Response);
                loadListDrinkToSelect(Response); // sự kiện load danh sách đồ uống vào select
            },
            error: function () {
                alert("Lấy dữ liệu đồ uống thất bại");
            }
        });
        getDailyCampaign(); // sự kiện load khuyến mãi theo từng ngày trong tuần
    }
    // hàm xử lý sự kiện load khuyến mãi theo từng ngày trong tuần
    function getDailyCampaign() {
        $.ajax({
            url:"http://localhost:8080/campaigns",
            type:"GET",
            async:false,
            success: function(res){
                console.log(res);
                $("#daily-campaign").html(res);
            },
            error: function(){
                console.log("Lỗi");
            }
        })
    }

    // hàm xử lý sự kiện nút chọn size S đc ấn
    function onBtnSmallClick() {
        var vMenu = getSize("S", "20 cm", 2, "200g", 2, 150000); // sự kiện gán dữ liệu size được chọn
        changeColorBtnSize("Small") // sự kiện đổi màu nút size đc ấn
    }
    // hàm xử lý sự kiện nút chọn size M đc ấn
    function onBtnMediumClick() {
        var vMenu = getSize("M", "25 cm", 4, "300g", 3, 200000); // sự kiện gán dữ liệu size được chọn
        changeColorBtnSize("Medium") // sự kiện đổi màu nút size đc ấn
    }
    // hàm xử lý sự kiện nút chọn size L đc ấn
    function onBtnLargeClick() {
        var vMenu = getSize("L", "30cm", 8, "500g", 4, 250000); // sự kiện gán dữ liệu size được chọn
        changeColorBtnSize("Large") // sự kiện đổi màu nút size đc ấn
    }
    // hàm xử lý sự kiện nút chọn pizza seafood
    function onBtnSeaFoodClick() {
        var vType = getType("SeaFood") // sự kiện gán dữ liệu type được chọn
        changeColorBtnType("SeaFood") // sự kiện đổi màu nút type đc ấn
    }
    // hàm xử lý sự kiện nút chọn pizza hawaii
    function onBtnHawaiiClick() {
        var vType = getType("Hawaii") // sự kiện gán dữ liệu type được chọn
        changeColorBtnType("Hawaii") // sự kiện đổi màu nút type đc ấn
    }
    // hàm xử lý sự kiện nút chọn pizza bacon
    function onBtnBaconClick() {
        var vType = getType("Bacon") // sự kiện gán dữ liệu type được chọn
        changeColorBtnType("Bacon") // sự kiện đổi màu nút type đc ấn
    }
    // hàm xử lý sự kiện nút gửi được ấn
    function onBtnSendClick() {

        // thu thâp dữ liệu
        readData(gUser)
        // kiểm tra dữ liệu
        var isCheck = checkData(gUser);
        if (isCheck) {
            // Hiển thị dữ liệu
            showDataOrder(gUser);
        }
    }
    // hàm xử lý sự kiện thu thâp dữ liệu
    function readData(paramUser) {
        $("#form-order input[name]").each(function () {
            paramUser[this.name] = this.value;
        });

    }
    // hàm xử lý sự kiện kiểm tra dữ liệu
    function checkData(paramUser) {
        var vDrink = $('#select-drink option:selected').val();
        if (gSelectedMenuStructure.menuName == "" || gSelectedPizzaType == "" || vDrink == "") {
            alert("Bạn cần chọn đầy đủ loại: Combo,Pizzi,Nước uống");
            return false;
        }
        $("#form-order input[name]:not([title])").each(function () {
            if (!paramUser[this.name]) {
                alert("Chưa nhập đủ thông tin bắt buộc");
                return false;
            }
        });

        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(paramUser.email)) {
            alert("Email không hợp lệ");
            return false;
        }
        if (isNaN(paramUser.phone)) {
            alert("Số điện thoại cần nhập là số");
            return false;
        }
        if (paramUser.phone.length < 10 || paramUser.phone.length > 10) {
            alert("Số điện thoại bao gồm 10 số");
            return false;
        }

        return true;
    }
    // hàm xử lý sự kiện hiển thị dữ liệu
    function showDataOrder(paramUser) {
        $("#detail-modal").modal();
        $("#detail-modal input[name]").each(function () {
            $(this).val(paramUser[$(this).attr("name")]);
        });
        if (paramUser.voucher != "") {
            callApiVoucher(paramUser.voucher); // sự kiện gọi api kiểm tra voucher và lấy discount
        }
        else {
            $("#detail-modal .modal-body small").hide()
            gVoucher = "";
            showTextera(gSelectedMenuStructure, gSelectedPizzaType)  // sự kiện load thông tin vào texttera
        }
    }
    // hàm xử lý sự kiện nút accept (tạo đơn ) được ấn
    function onBtnAcceptClick() {
        var vDataOder = {
            kichCo: "",
            duongKinh: "",
            suon: "",
            salad: "",
            loaiPizza: "",
            idVourcher: "",
            idLoaiNuocUong: "",
            soLuongNuoc: "",
            hoTen: "",
            thanhTien: "",
            email: "",
            soDienThoai: "",
            diaChi: "",
            loiNhan: ""
        };
        // thu thập dữ liệu Accept
        readDataAccept(vDataOder)
        // Gọi server tạo đơn hàng
        callApiPostOrder(vDataOder)
        // // show Result
        // showResult(vDataOder)
    }
    // hàm xử lý sự kiện thu thập dữ liệu Accept
    function readDataAccept(paramDataOder) {
        paramDataOder.kichCo = gSelectedMenuStructure.menuName;
        paramDataOder.duongKinh = gSelectedMenuStructure.duongKinhCM;
        paramDataOder.suon = gSelectedMenuStructure.suonNuong;
        paramDataOder.salad = gSelectedMenuStructure.saladGr;
        paramDataOder.loaiPizza = gSelectedPizzaType;
        paramDataOder.idVourcher = "" ? gVoucher == "" : gVoucher.maVoucher;
        // if (gVoucher == "") {

        //     paramDataOder.idVourcher = "";

        // }
        // else {
        //     paramDataOder.idVourcher = gVoucher.maVoucher;

        // }
        paramDataOder.idLoaiNuocUong = $('#select-drink option:selected').val();
        paramDataOder.soLuongNuoc = gSelectedMenuStructure.drink;
        paramDataOder.hoTen = gUser.name;
        paramDataOder.thanhTien = gThanhTien;
        paramDataOder.email = gUser.email;
        paramDataOder.soDienThoai = gUser.phone;
        paramDataOder.diaChi = gUser.address;
        paramDataOder.loiNhan = gUser.message;
    }
    // hàm xử lý sự kiện gọi server tạo đơn hàng
    function callApiPostOrder(paramDataOder) {
        $.ajax({
            url: "http://42.115.221.44:8080/devcamp-pizza365/orders",
            type: "POST",
            async: false,
            contentType: "application/json;charset=UTF-8",
            data: JSON.stringify(paramDataOder),
            success: function (res) {
                console.log(res);
                resetForm(); // sự kiện ẩn và reset form modal
                showResult(res) // sự kiện show orderId
            },
            error: function () {
                alert("Lỗi")
            }
        })
    }
    // hàm xử lý sự kiện ẩn và reset form modal
    function resetForm() {
        $("#detail-modal").modal("hide");
        $("#detail-modal input[name]").each(function () {
            $(this).val("");
        });
        $("#modal-inp-detail").val("");
    }
    // hàm xử lý sự kiện show orderId
    function showResult(paramRes) {
        $("#result-modal").modal();
        $("#inp-orderid").val(paramRes.orderId);
    }
    /*** REGION 4 - Common funtions - Vùng khai báo hàm dùng chung trong toàn bộ chương trình*/
    // hàm xử lý sự kiện gán dữ liệu size được chọn 
    function getSize(paramName, paramDuongKinh, paramSuonNuong, paramSalad, paramDrink, paramPrice) {
        gSelectedMenuStructure.menuName = paramName;
        gSelectedMenuStructure.duongKinhCM = paramDuongKinh;
        gSelectedMenuStructure.suonNuong = paramSuonNuong;
        gSelectedMenuStructure.saladGr = paramSalad;
        gSelectedMenuStructure.drink = paramDrink;
        gSelectedMenuStructure.priceVND = paramPrice;
        console.log(gSelectedMenuStructure);
    }
    // hàm xử lý sự kiện đổi màu nút size đc ấn
    function changeColorBtnSize(paramSize) {
        if (paramSize == "Small") {
            $("#btn-small").addClass("btn btn-info w-100").removeClass("btn-select");
            $("#btn-medium").addClass("btn w-100 btn-select").removeClass("btn-info");
            $("#btn-large").addClass("btn w-100 btn-select").removeClass("btn-info");
        }
        if (paramSize == "Medium") {
            $("#btn-small").addClass("btn w-100 btn-select").removeClass("btn-info");
            $("#btn-medium").addClass("btn btn-info w-100").removeClass("btn-select");
            $("#btn-large").addClass("btn w-100 btn-select").removeClass("btn-info");
        }
        if (paramSize == "Large") {
            $("#btn-small").addClass("btn w-100 btn-select").removeClass("btn-info");
            $("#btn-medium").addClass("btn w-100 btn-select").removeClass("btn-info");
            $("#btn-large").addClass("btn btn-info w-100").removeClass("btn-select");
        }
    }
    // hàm xử lý sự kiện gán dữ liệu type được chọn
    function getType(paramType) {
        gSelectedPizzaType = paramType;
        console.log(paramType);
    }
    // hàm xử lý sự kiện đổi màu nút type đc ấn
    function changeColorBtnType(paramType) {
        if (paramType == "SeaFood") {
            $("#btn-seafood").addClass("btn btn-info w-100").removeClass("btn-select");
            $("#btn-hawaii").addClass("btn w-100 btn-select").removeClass("btn-info");
            $("#btn-bacon").addClass("btn w-100 btn-select").removeClass("btn-info");
        }
        if (paramType == "Hawaii") {
            $("#btn-seafood").addClass("btn w-100 btn-select").removeClass("btn-info");
            $("#btn-hawaii").addClass("btn btn-info w-100").removeClass("btn-select");
            $("#btn-bacon").addClass("btn w-100 btn-select").removeClass("btn-info");
        }
        if (paramType == "Bacon") {
            $("#btn-seafood").addClass("btn w-100 btn-select").removeClass("btn-info");
            $("#btn-hawaii").addClass("btn w-100 btn-select").removeClass("btn-info");
            $("#btn-bacon").addClass("btn btn-info w-100").removeClass("btn-select");
        }
    }
    // hàm xử lý sự kiện load danh sách đồ uống vào select
    function loadListDrinkToSelect(paramDrink) {
        for (var bI in paramDrink) {
            var vOption = $("<option>", {
                text: paramDrink[bI].tenNuocUong,
                value: paramDrink[bI].maNuocUong
            });
            $("#select-drink").append(vOption);
        }
    }
    // hàm xử lý sự kiện gọi api kiểm tra voucher và lấy discount
    function callApiVoucher(paramVoucher) {
        $.ajax({
            url: "http://42.115.221.44:8080/devcamp-voucher-api/voucher_detail/" + paramVoucher,
            type: "GET",
            async: false,
            success: function (responseVoucher) {
                $("#detail-modal .modal-body small").hide()
                console.log(responseVoucher);
                gVoucher = responseVoucher;
                showTexteraIfAnyVoucher(gVoucher, gSelectedMenuStructure, gSelectedPizzaType); // sự kiện load thông tin vào texttera khi có nhập voucher
            },
            error: function () {
                $("#detail-modal .modal-body small").show().addClass("text-red");
                showTextera(gSelectedMenuStructure, gSelectedPizzaType);
                gVoucher = "";
            }
        })
    }
    // hàm xử lý sự kiện load thông tin vào texttera khi có nhập voucher
    function showTexteraIfAnyVoucher(paramVoucher, paramSelectMenu, paramType) {
        gThanhTien = paramSelectMenu.priceVND - (paramSelectMenu.priceVND * paramVoucher.phanTramGiamGia) / 100;
        var vDrink = $('#select-drink option:selected').val();
        $("#modal-inp-detail").val(
            "Loại Pizza: " + paramType + "\n" +
            "Menu: " + paramSelectMenu.menuName + ", đường kính: " + paramSelectMenu.duongKinhCM + ", sườn nướng: " + paramSelectMenu.suonNuong + " miếng" +
            ", salad: " + paramSelectMenu.saladGr + ", nước ngọt: " + paramSelectMenu.drink + " cốc" + ", loại nước ngọt: " + vDrink + ", Giá: " + paramSelectMenu.priceVND + " VNĐ" +
            ", phần trăm giảm giá: " + paramVoucher.phanTramGiamGia + "%" + ", thành tiền: " + gThanhTien + " VNĐ"
        );
    }
    // hàm xử lý sự kiện load thông tin vào texttera
    function showTextera(paramSelectMenu, paramType) {
        var vDrink = $('#select-drink option:selected').val();
        gThanhTien = paramSelectMenu.priceVND;
        $("#modal-inp-detail").val(
            "Loại Pizza: " + paramType + "\n" +
            "Menu: " + paramSelectMenu.menuName + ", đường kính: " + paramSelectMenu.duongKinhCM + ", sườn nướng: " + paramSelectMenu.suonNuong + " miếng" +
            ", salad: " + paramSelectMenu.saladGr + ", nước ngọt: " + paramSelectMenu.drink + " cốc" + ", loại nước ngọt: " + vDrink + ", Giá: " + gThanhTien + " VNĐ"
        );
    }
})