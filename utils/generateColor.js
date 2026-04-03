const generateColor = (email) => {
    const colors = [
        "linear-gradient(135deg, #667eea, #764ba2)",
        "linear-gradient(135deg, #f093fb, #f5576c)",
        "linear-gradient(135deg, #4facfe, #00f2fe)",
        "linear-gradient(135deg, #43e97b, #38f9d7)",
        "linear-gradient(135deg, #fa709a, #fee140)",
        "linear-gradient(135deg, #30cfd0, #330867)",
        "linear-gradient(135deg, #a18cd1, #fbc2eb)",
        "linear-gradient(135deg, #f6d365, #fda085)",
        "linear-gradient(135deg, #ff9a9e, #fad0c4)",
        "linear-gradient(135deg, #ffecd2, #fcb69f)",
        "linear-gradient(135deg, #a1c4fd, #c2e9fb)",
        "linear-gradient(135deg, #d4fc79, #96e6a1)",
        "linear-gradient(135deg, #84fab0, #8fd3f4)",
        "linear-gradient(135deg, #fccb90, #d57eeb)",
        "linear-gradient(135deg, #e0c3fc, #8ec5fc)",
        "linear-gradient(135deg, #f093fb, #f5576c)",
        "linear-gradient(135deg, #5ee7df, #b490ca)",
        "linear-gradient(135deg, #cfd9df, #e2ebf0)",
        "linear-gradient(135deg, #89f7fe, #66a6ff)",
        "linear-gradient(135deg, #ff758c, #ff7eb3)",
        "linear-gradient(135deg, #43cea2, #185a9d)",
        "linear-gradient(135deg, #ff9966, #ff5e62)",
        "linear-gradient(135deg, #7f00ff, #e100ff)",
        "linear-gradient(135deg, #00c6ff, #0072ff)",
        "linear-gradient(135deg, #f7971e, #ffd200)"

    ];

    let hash = 0;
    for (let i = 0; i < email.length; i++) {
        hash = email.charCodeAt(i) + ((hash << 5) - hash);
    }

    const index = Math.abs(hash % colors.length);
    return colors[index];
};

module.exports = generateColor;