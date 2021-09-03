 // let prize = ['矿石', '随机限量徽章', '掘金新款T恤', 'Bug', '乐高海洋巨轮', '掘金限量桌垫', 'Yoyo抱枕', 'Switch'];


        //获取奖品总数
        function getPrizeSum(number) {
            let prizeSum=0;
            for (let i = 0; i < number.length; i++) {
                prizeSum += number[i];
            }
            return prizeSum;
        }
        //抽奖函数
        function random(prizeArr,number) {
            let prizeSum=getprizeSum(number);
            let probabilityArr= number.map((v) => v / prizeSum);

            let sum = 0,
                factor = 0,
                random = Math.random();
            for (var i = probabilityArr.length - 1; i >= 0; i--) {
                sum += probabilityArr[i]; // 统计概率总和
            };
            random *= sum; // 生成概率随机数
            for (var i = probabilityArr.length - 1; i >= 0; i--) {
                factor += probabilityArr[i];
                if (random <= factor) {
                    prizeSum--;
                    number[i]--;
                    return prizeArr[i];
                }
            };
            return null;
        };



        let prizeArr=['mac', 'iphone', 'vivo', 'OPPO'];
        let number=[1,1, 3, 4];
        let bg=getprizeSum(number)


        //test中奖次数
        let times = {};
        for (let i = 0; i <prizeArr.length; i++) {
            times[prizeArr[i]] = 0;
        }
        for (let i = 0; i < bg; i++) {
            let prize=random(prizeArr,number);
            console.log(`你抽中了${prize}`);
            times[prize]++;
        }
        console.log(times);
