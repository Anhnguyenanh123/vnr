import type { ExhibitData, RoomQuiz } from "@/types/museum";

export const museumData: ExhibitData[] = [
  {
    id: "room1-exhibit1",
    title: "Cuộc tập kích chiến lược của Mỹ tháng 12/1972",
    position: { x: 300, y: 300 },
    roomNumber: 1,
    image: "/pic/r1-e1.webp",
    content: `Tháng 12 năm 1972, Mỹ mở cuộc tập kích chiến lược bằng máy bay B-52 quy mô lớn nhất trong Chiến tranh Việt Nam, nhằm buộc Việt Nam Dân chủ Cộng hòa phải khuất phục trên bàn đàm phán Paris.
Trong 12 ngày đêm khói lửa, Thủ đô Hà Nội cùng Hải Phòng và các địa phương miền Bắc trở thành trọng điểm ném bom ác liệt. Máy bay B-52 và F-111 liên tiếp trút bom xuống khu dân cư, bệnh viện, trường học, ga Hàng Cỏ, phố Khâm Thiên…
Tuy nhiên, với ý chí kiên cường và tinh thần “Quyết tử cho Tổ quốc quyết sinh”, quân dân miền Bắc, đặc biệt là lực lượng Phòng không – Không quân, đã bắn rơi 81 máy bay Mỹ, trong đó có 34 chiếc B-52, làm nên chiến thắng vang dội “Điện Biên Phủ trên không”.
Chiến thắng này buộc Mỹ phải ký Hiệp định Paris ngày 27/1/1973, chấm dứt chiến tranh, lập lại hòa bình ở Việt Nam.`,
  },
  {
    id: "room1-exhibit2",
    title: "Kế hoạch tấn công của Nixon và khởi đầu không kích",
    position: { x: 300, y: 600 },
    roomNumber: 1,
    image: "/pic/r1-e2.jpg",
    content: `Ngày 14 tháng 12 năm 1972, Tổng thống Nixon đã phê duyệt kế hoạch tấn công bằng đường không vào Hà Nội và Hải Phòng.
Không quân Hoa Kỳ tiến hành các cuộc không kích bằng máy bay ném bom chiến lược B-52 Stratofortress, tầm xa, siêu thanh, động cơ phản lực. Trong ảnh, máy bay ném bom B-52 đã phá hủy hoàn toàn Bệnh viện Bạch Mai ở Hà Nội.`,
  },
  {
    id: "room2-exhibit1",
    title: "Tấn công Đài Tiếng nói Việt Nam và thiệt hại cơ sở hạ tầng",
    position: { x: 300, y: 900 },
    roomNumber: 2,
    image: "/pic/r2-e1.png",
    content: `Đài phát thanh Mễ Trì của Đài Tiếng nói Việt Nam (VOV) bị tấn công vào đêm 18 tháng 12. Mặc dù thiệt hại về tài sản nặng nề, VOV vẫn tiếp tục phát sóng sau 9 phút im lặng.
Các cuộc không kích nhắm vào các mục tiêu dân sự, gây thiệt hại nghiêm trọng cho cơ sở hạ tầng và đời sống nhân dân miền Bắc.`,
  },
  {
    id: "room2-exhibit2",
    title: "Thảm họa phố Khâm Thiên và mất mát sinh mạng",
    position: { x: 700, y: 600 },
    roomNumber: 2,
    image: "/pic/r2-e2.jpg",
    content: `Phố Khâm Thiên ở Hà Nội bị đổ nát vào đêm ngày 26 tháng 12. Tổng cộng có 278 người thiệt mạng, chủ yếu là phụ nữ, người già và trẻ em.
Bom đạn Mỹ đã tàn phá nặng nề khu dân cư đông đúc, để lại nỗi đau thương lớn lao cho nhân dân Thủ đô.`,
  },
  {
    id: "room3-exhibit1",
    title: "Sơ tán dân cư và xây dựng hầm trú ẩn",
    position: { x: 1300, y: 300 },
    roomNumber: 3,
    image: "/pic/r3-e1.jpg",
    content: `Người dân đã được sơ tán đến nơi an toàn.
Các hầm trú bom ven đường cá nhân được dựng lên dọc theo các con phố.
Dù đối mặt với bom đạn ác liệt, nhân dân Hà Nội vẫn thể hiện tinh thần kiên cường, tổ chức sơ tán và trú ẩn hiệu quả để bảo vệ tính mạng.`,
  },
  {
    id: "room3-exhibit2",
    title: "Sự kháng cự anh dũng của quân dân miền Bắc",
    position: { x: 1300, y: 600 },
    roomNumber: 3,
    image: "/pic/r3-e2.jpg",
    content: `Các cuộc không kích của Mỹ đã vấp phải sự kháng cự mạnh mẽ của người dân Việt Nam. Trong ảnh, lính pháo binh đang trực chiến.
Đơn vị không quân Sao Đỏ đã góp phần vào chiến thắng của trận chiến.
Quân và dân ta ngày đêm sẵn sàng chiến đấu, bảo vệ bầu trời Tổ quốc với quyết tâm sắt đá.`,
  },
  {
    id: "room4-exhibit1",
    title: "Anh hùng Phạm Tuân và các chiến công bắn rơi B-52",
    position: { x: 1700, y: 300 },
    roomNumber: 4,
    image: "/pic/r4-e1.jpg",
    content: `Anh hùng Phạm Tuân lái máy bay MiG-21 bắn rơi máy bay ném bom B-52.
Một phi công Mỹ bị bắt trên hồ Trúc Bạch ở Hà Nội.
Bữa ăn hàng ngày của các phi công bị bắt tại Nhà tù Hỏa Lò ở Hà Nội.
Các anh hùng lực lượng Phòng không - Không quân đã lập nên kỳ tích, bắn rơi hàng loạt máy bay Mỹ, góp phần quyết định vào thắng lợi chung.`,
  },
  {
    id: "room4-exhibit2",
    title: "Chiến thắng 'Điện Biên Phủ trên không' và Hiệp định Paris",
    position: { x: 1700, y: 600 },
    roomNumber: 4,
    image: "/pic/r4-e2.jpg",
    content: `Thất bại của các cuộc không kích đã buộc Mỹ và tay sai phải ngồi vào bàn đàm phán năm 1973 và ký Hiệp định Paris, chấm dứt chiến tranh ở Việt Nam. Trong ảnh, bà Nguyễn Thị Bình, Bộ trưởng Ngoại giao Chính phủ Cách mạng Lâm thời Cộng hòa miền Nam Việt Nam, đã ký hiệp định vào ngày 27 tháng 1 năm 1973.
Xác máy bay ném bom B-52, trung tâm thành phố Hà Nội, Việt Nam.
Chiến thắng vang dội này không chỉ bảo vệ miền Bắc mà còn mở đường cho cuộc tổng tiến công mùa Xuân 1975, thống nhất đất nước.`,
  },
];

export const roomQuizzes: RoomQuiz[] = [
  {
    roomNumber: 1,
    questions: [
      {
        question:
          "Mục tiêu chính của cuộc tập kích chiến lược của Mỹ tháng 12/1972 là gì?",
        options: [
          "Hủy diệt lực lượng không quân Việt Nam",
          "Buộc Việt Nam Dân chủ Cộng hòa khuất phục trên bàn đàm phán Paris",
          "Hỗ trợ quân đội miền Nam Việt Nam",
          "Kiểm soát tuyến đường Hồ Chí Minh",
        ],
        correctAnswer: 1,
      },
      {
        question: "Cuộc tập kích kéo dài bao nhiêu ngày đêm?",
        options: ["7 ngày đêm", "12 ngày đêm", "18 ngày đêm", "30 ngày đêm"],
        correctAnswer: 1,
      },
      {
        question:
          "Quân dân miền Bắc đã bắn rơi tổng cộng bao nhiêu máy bay Mỹ trong chiến dịch này?",
        options: ["34 chiếc", "81 chiếc", "100 chiếc", "50 chiếc"],
        correctAnswer: 1,
      },
      {
        question:
          "Chiến thắng 'Điện Biên Phủ trên không' đã buộc Mỹ ký hiệp định nào?",
        options: [
          "Hiệp định Genève",
          "Hiệp định Paris ngày 27/1/1973",
          "Hiệp định Sơ bộ 1946",
          "Hiệp định Potsdam",
        ],
        correctAnswer: 1,
      },
      {
        question:
          "Ngày nào Tổng thống Nixon phê duyệt kế hoạch tấn công bằng đường không vào Hà Nội và Hải Phòng?",
        options: [
          "Ngày 18 tháng 12 năm 1972",
          "Ngày 14 tháng 12 năm 1972",
          "Ngày 26 tháng 12 năm 1972",
          "Ngày 27 tháng 1 năm 1973",
        ],
        correctAnswer: 1,
      },
    ],
  },
  {
    roomNumber: 2,
    questions: [
      {
        question: "Đài Tiếng nói Việt Nam (VOV) bị tấn công vào đêm ngày nào?",
        options: ["14 tháng 12", "18 tháng 12", "26 tháng 12", "27 tháng 1"],
        correctAnswer: 1,
      },
      {
        question:
          "Sau khi bị tấn công, Đài Tiếng nói Việt Nam tiếp tục phát sóng sau bao lâu?",
        options: [
          "9 phút im lặng",
          "1 giờ im lặng",
          "9 giờ im lặng",
          "1 ngày im lặng",
        ],
        correctAnswer: 0,
      },
      {
        question:
          "Các cuộc không kích của Mỹ chủ yếu nhắm vào những mục tiêu nào?",
        options: [
          "Chỉ các mục tiêu quân sự",
          "Các mục tiêu dân sự như khu dân cư, bệnh viện",
          "Chỉ các sân bay không quân",
          "Các tuyến đường bộ",
        ],
        correctAnswer: 1,
      },
      {
        question: "Phố Khâm Thiên bị đổ nát vào đêm ngày nào?",
        options: ["14 tháng 12", "18 tháng 12", "26 tháng 12", "27 tháng 1"],
        correctAnswer: 2,
      },
      {
        question:
          "Tổng số người thiệt mạng ở phố Khâm Thiên là bao nhiêu, chủ yếu là ai?",
        options: [
          "178 người, chủ yếu là nam giới",
          "278 người, chủ yếu là phụ nữ, người già và trẻ em",
          "378 người, chủ yếu là binh sĩ",
          "100 người, chủ yếu là trẻ em",
        ],
        correctAnswer: 1,
      },
    ],
  },
  {
    roomNumber: 3,
    questions: [
      {
        question:
          "Trong cuộc không kích, người dân Hà Nội đã làm gì để bảo vệ tính mạng?",
        options: [
          "Tiếp tục sinh hoạt bình thường",
          "Sơ tán đến nơi an toàn và xây dựng hầm trú bom",
          "Di chuyển đến miền Nam",
          "Ẩn náu trong các tòa nhà cao tầng",
        ],
        correctAnswer: 1,
      },
      {
        question: "Các hầm trú bom được dựng ở đâu?",
        options: [
          "Trong các bệnh viện",
          "Ven đường cá nhân dọc theo các con phố",
          "Dưới các trường học",
          "Tại các ga tàu",
        ],
        correctAnswer: 1,
      },
      {
        question:
          "Lực lượng nào đã trực chiến mạnh mẽ chống lại các cuộc không kích?",
        options: [
          "Lực lượng bộ binh",
          "Lính pháo binh và đơn vị không quân Sao Đỏ",
          "Lực lượng hải quân",
          "Dân quân tự vệ địa phương",
        ],
        correctAnswer: 1,
      },
      {
        question:
          "Tinh thần của quân dân miền Bắc trong cuộc kháng cự được thể hiện như thế nào?",
        options: [
          "Sẵn sàng đầu hàng",
          "Ngày đêm sẵn sàng chiến đấu với quyết tâm sắt đá",
          "Chỉ phòng thủ thụ động",
          "Yêu cầu đàm phán ngay lập tức",
        ],
        correctAnswer: 1,
      },
      {
        question:
          "Nhân dân Hà Nội thể hiện tinh thần gì dù đối mặt với bom đạn ác liệt?",
        options: [
          "Hoảng loạn và chạy trốn",
          "Kiên cường, tổ chức sơ tán và trú ẩn hiệu quả",
          "Tấn công trực tiếp vào máy bay Mỹ",
          "Bỏ chạy khỏi thành phố",
        ],
        correctAnswer: 1,
      },
    ],
  },
  {
    roomNumber: 4,
    questions: [
      {
        question: "Anh hùng Phạm Tuân đã lái loại máy bay nào để bắn rơi B-52?",
        options: [
          "Máy bay B-52",
          "Máy bay MiG-21",
          "Máy bay F-111",
          "Máy bay Stratofortress",
        ],
        correctAnswer: 1,
      },
      {
        question: "Một phi công Mỹ bị bắt ở đâu tại Hà Nội?",
        options: [
          "Sân bay Nội Bài",
          "Hồ Trúc Bạch",
          "Phố Khâm Thiên",
          "Bệnh viện Bạch Mai",
        ],
        correctAnswer: 1,
      },
      {
        question: "Các phi công Mỹ bị bắt được giam giữ ở đâu?",
        options: [
          "Nhà tù Hỏa Lò",
          "Trại giam Phú Quốc",
          "Đài Tiếng nói Việt Nam",
          "Hầm trú bom",
        ],
        correctAnswer: 0,
      },
      {
        question: "Hiệp định Paris được ký vào ngày nào năm 1973?",
        options: ["27 tháng 1", "14 tháng 12", "18 tháng 12", "26 tháng 12"],
        correctAnswer: 0,
      },
      {
        question:
          "Ai là người ký Hiệp định Paris đại diện cho Chính phủ Cách mạng Lâm thời Cộng hòa miền Nam Việt Nam?",
        options: [
          "Tổng thống Nixon",
          "Bà Nguyễn Thị Bình",
          "Anh hùng Phạm Tuân",
          "Tổng Bí thư Lê Duẩn",
        ],
        correctAnswer: 1,
      },
    ],
  },
];
