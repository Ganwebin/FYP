
// Utility function to calculate Ba Zi based on birth date
function calculateBazi(year, month, day, hour) {
    // 输入验证
    if (!year || !month || !day) {
        throw new Error('日期参数不完整');
    }

    const celestialStems = ['Jia', 'Yi', 'Bing', 'Ding', 'Wu', 'Ji', 'Geng', 'Xin', 'Ren', 'Gui'];
    const terrestrialBranches = ['Zi', 'Chou', 'Yin', 'Mao', 'Chen', 'Si', 'Wu', 'Wei', 'Shen', 'You', 'Xu', 'Hai'];
    
    // 确保输入值在有效范围内
    year = parseInt(year);
    month = parseInt(month);
    day = parseInt(day);
    hour = parseInt(hour || 0);

    if (year < 1900 || year > 2100 || month < 1 || month > 12 || day < 1 || day > 31) {
        throw new Error('日期超出有效范围');
    }

    const yearStem = celestialStems[(year - 4) % 10];
    const yearBranch = terrestrialBranches[(year - 4) % 12];
    const monthStem = celestialStems[(month + 2) % 10];
    const monthBranch = terrestrialBranches[month - 1];
    const dayStem = celestialStems[day % 10];
    const dayBranch = terrestrialBranches[day % 12];
    const hourStem = celestialStems[hour % 10];
    const hourBranch = terrestrialBranches[Math.floor(hour / 2) % 12];
    
    return {
        year: { stem: yearStem, branch: yearBranch },
        month: { stem: monthStem, branch: monthBranch },
        day: { stem: dayStem, branch: dayBranch },
        hour: { stem: hourStem, branch: hourBranch }
    };
}

// Function to determine element affinities based on Ba Zi
function getElementAffinities(bazi) {
    const elementMap = {
        'Jia': 'Wood', 'Yi': 'Wood',
        'Bing': 'Fire', 'Ding': 'Fire',
        'Wu': 'Earth', 'Ji': 'Earth',
        'Geng': 'Metal', 'Xin': 'Metal',
        'Ren': 'Water', 'Gui': 'Water'
    };
    
    const elements = {
        'Metal': 0, 'Wood': 0, 'Water': 0, 'Fire': 0, 'Earth': 0
    };
    
    const pillars = [bazi.year, bazi.month, bazi.day, bazi.hour];
    const weights = [1, 2, 3, 1]; // 年月日时的权重
    
    pillars.forEach((pillar, index) => {
        const element = elementMap[pillar.stem];
        if (element) {
            elements[element] += weights[index];
        }
    });
    
    return elements;
}

// Function to get career recommendations based on Ba Zi and preferences
function getCareerRecommendation(bazi, gender, career) {
    const elementAffinities = getElementAffinities(bazi);
    
    // 扩展职业选项并添加英文说明
    const careerElements = {
        'Metal': ['Finance', 'Insurance', 'Science', 'Jewelry', 'Automotive', 'Mechanical Engineering', 'Hardware', 'Investment', 'Financial Services', 'Mining'],
        'Wood': ['Education', 'Healthcare', 'Publishing', 'Environmental', 'Wood Manufacturing', 'Renovation', 'Gallery', 'Furniture', 'Horticulture', 'Religious Supplies', 'Paper Manufacturing', 'Plantation', 'Clothing and Textile'],
        'Water': ['Legal', 'Tourism', 'Logistics', 'Maritime', 'Entertainment', 'Design', 'Trade', 'Toy', 'Beverage', 'Aquaculture', 'Audio', 'Urology and ENT'],
        'Fire': ['Energy', 'Consulting', 'Aviation', 'Beauty', 'Writing', 'Data', 'Virtual', 'Catering', 'Health', 'Metaphysics', 'Aesthetics', 'Ophthalmology and Cardiology'],
        'Earth': ['Real Estate', 'Construction', 'Agriculture', 'Food', 'Funeral', 'Antique', 'Pet', 'Accounting', 'Nursing', 'Artifact', 'Cement Construction', 'Animal Husbandry', 'Pawnshop', 'Food Processing']
    };
    
    const recommendations = [];
    for (const element in elementAffinities) {
        const careers = careerElements[element];
        // 调整基础分数计算
        const baseScore = (elementAffinities[element] / 7) * 100; // 归一化到100分制
        
        let suitability = baseScore;
        if (career && careers.some(c => c.toLowerCase().includes(career.toLowerCase()))) {
            suitability += 15;
        }
        
        suitability = Math.min(100, Math.max(0, suitability));
        
        // 为每个元素推荐多个职业
        careers.forEach((careerOption, index) => {
            recommendations.push({
                career: careerOption,
                element: element,
                suitability: Math.round(suitability - (index * 5)) // 同一元素下的职业略微区分适应度
            });
        });
    }
    
    return recommendations.sort((a, b) => b.suitability - a.suitability);
}

// Function to generate career suitability chart
function generateCareerChart(elementAffinities) {
    const ctx = document.getElementById('careerChart').getContext('2d');
    
    const data = {
        labels: ['Metal', 'Wood', 'Water', 'Fire', 'Earth'],
        datasets: [{
            data: Object.values(elementAffinities),
            backgroundColor: [
                'rgba(255, 215, 0, 0.6)', // Metal
                'rgba(144, 238, 144, 0.6)', // Wood
                'rgba(173, 216, 230, 0.6)', // Water
                'rgba(255, 182, 193, 0.6)', // Fire
                'rgba(221, 160, 221, 0.6)'  // Earth
            ],
            borderColor: [
                'rgba(255, 215, 0, 1)',
                'rgba(144, 238, 144, 1)',
                'rgba(173, 216, 230, 1)',
                'rgba(255, 182, 193, 1)',
                'rgba(221, 160, 221, 1)'
            ],
            borderWidth: 1
        }]
    };
    
    new Chart(ctx, {
        type: 'pie',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        font: {
                            size: 14
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Element Analysis Chart',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                }
            }
        }
    });
}

// DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    const name = localStorage.getItem('name');
    const gender = localStorage.getItem('gender');
    const birthDate = localStorage.getItem('birthDate');
    const career = localStorage.getItem('career');

    console.log('name:', name);
    console.log('gender:', gender);
    console.log('birthDate:', birthDate);
    console.log('career:', career);

    if (!name || !gender || !birthDate || !career) {
        document.getElementById('userInfo').innerHTML = '<div class="error">Unable to retrieve user information, please <a href="index.html">go back and re-enter</a>.</div>';
        return;
    }

    const [year, month, day] = birthDate.split('-');
    const hour = '00';
    const bazi = calculateBazi(parseInt(year), parseInt(month), parseInt(day), parseInt(hour));

    console.log('bazi:', bazi);

    const elementAffinities = getElementAffinities(bazi);
    console.log('elementAffinities:', elementAffinities);

    const recommendations = getCareerRecommendation(bazi, gender, career);
    console.log('recommendations:', recommendations);

    generateCareerChart(elementAffinities);

    document.getElementById('userInfo').innerHTML = `
        <div class="user-info-item">Name: <strong>${name}</strong></div>
        <div class="user-info-item">Gender: <strong>${gender}</strong></div>
        <div class="user-info-item">Birth Date: <strong>${new Date(birthDate).toLocaleDateString('en-US')}</strong></div>
        <div class="user-info-item">Interested Career: <strong>${career}</strong></div>
    `;

    // 改进职业建议显示
    const jobTableBody = document.getElementById('jobTableBody');
    jobTableBody.innerHTML = '';
    recommendations.slice(0, 8).forEach((job, index) => { // 只显示前8个建议
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="career-cell">
                <span class="career-name">${job.career}</span>
                <span class="career-element">${job.element}</span>
            </td>
        `;
        jobTableBody.appendChild(row);
    });
});
            
                
