import Tab from "./Tab";

// 和文件名相同
const taskName = "download-walmart-fee";

function queryElement(query) {
    return Promise.race([
        new Promise(resolve => {
            function exec() {
                const el = query();

                console.log("exec", el, query);
                if (el) {
                    resolve(el);
                } else {
                    setTimeout(exec, 500)
                }
            }

            exec();
        }),
        new Promise(resolve => setTimeout(resolve, 1000 * 5)),
    ]);
}


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const {
        name,
        data,
    } = message;

    if (name === `vevor-ping-${taskName}`) {
        sendResponse({
            name: `vevor-pong-${taskName}`,
        });
    } else if (name === `vevor-${taskName}`) {
        // 业务逻辑写在这里
        const {
            // 任务需要用到的一些参数
            params,
        } = data;

        console.log(data);

        // https://seller.walmart.ca/resource/onboarding/getEFTStatus

        Promise.race([
            new Promise((resolve) => {
                chrome.runtime.sendMessage({
                    name: 'vevor-web-request-oncompleted',
                    url: 'https://seller.walmart.com/api/logger'
                }, (response) => {
                    resolve({
                        message: '跳转成功'
                    });
                });
            }),
            new Promise(resolve => setTimeout(() => {
                resolve({
                    status: 'fail',
                    message: '确认结果超时'
                });
            }, 1000 * 60 * 2))
        ]).then(() => {
            walmart()
        })

        function walmart() {
            document.querySelector('._2G6Es').children[0].children[0].click()
            document.querySelectorAll('.option')[0].click()
            document.querySelectorAll('._3MglK')[1].click()
            Promise.race([
                new Promise((resolve) => {
                    chrome.runtime.sendMessage({
                        name: 'vevor-web-request-oncompleted',
                        url: 'https://seller.walmart.com/api/logger'
                    }, (response) => {
                        resolve({
                            message: '跳转成功'
                        });
                    });
                }),

                new Promise(resolve => setTimeout(() => {
                    resolve({
                        status: 'fail',
                        message: '确认结果超时'
                    });
                }, 1000 * 60 * 2))
            ]).then(() => {
                if (document.querySelectorAll('._3MglK')[1].getAttribute('disabled') !== null) {
                    return
                } else {
                    demo()
                }
            })
        }

        Promise.race([
            new Promise((resolve) => {
                chrome.runtime.sendMessage({
                    name: 'vevor-web-request-oncompleted',
                    url: 'https://seller.walmart.ca/resource/onboarding/getEFTStatus'
                }, (response) => {
                    resolve({
                        message: '跳转成功'
                    });
                });
            }),
            new Promise(resolve => setTimeout(() => {
                resolve({
                    status: 'fail',
                    message: '确认结果超时'
                });
            }, 1000 * 60 * 2))
        ]).then(() => {
            walmartCa()
        })

        function walmartCa() {
            document.querySelectorAll('.dwnld-dropdown')[1].children[1].click()
            document.querySelectorAll('.icon-padding')[1].click()
            Promise.race([
                new Promise((resolve) => {
                    chrome.runtime.sendMessage({
                        name: 'vevor-web-request-oncompleted',
                        url: 'https://seller.walmart.ca/resource/onboarding/getEFTStatus'
                    }, (response) => {
                        resolve({
                            message: '跳转成功'
                        });
                    });
                }),

                new Promise(resolve => setTimeout(() => {
                    resolve({
                        status: 'fail',
                        message: '确认结果超时'
                    });
                }, 1000 * 60 * 2))
            ]).then(() => {
                if (document.querySelector('.wm-grid-pagination').children[2].className === 'disabled') {
                    return
                } else {
                    walmartCa()
                }
            })
        }






        // await Promise.race([
        //     new Promise((resolve) => {
        //         chrome.runtime.sendMessage({
        //             name: 'vevor-tabs-onupdated',
        //         }, (response) => {
        //             document.documentElement.style.background = 'red'
        //             resolve({
        //                 message: '跳转成功'
        //             });
        //         });

        //         setTimeout(() => {
        //             document.documentElement.style.background = 'black'
        //         }, 1000 * 10);
        //     }),
        //     new Promise(resolve => setTimeout(() => {
        //         resolve({
        //             status: 'fail',
        //             message: '确认结果超时'
        //         });
        //     }, 1000 * 60 * 2))
        // ])


        // document.querySelectorAll('.option')[0].click()
        // document.querySelector('.css-kry775-control').click()
        // const carrierOption = await queryElement(() => document.getElementById(`CarrierListDropdown-${carrierKey}_${carrierIndex}`));

        // if (!carrierOption) {
        //     throw new Error('carrierOption not found');
        // }

        // const carrierOption1 = await queryElement(() => document.querySelector('._1QQQZ'));
        // const carrierOption2 = await queryElement(() => document.querySelector('.css-lg2xwb-container'));
        // const carrierOption3 = await queryElement(() => document.querySelector('.css-kry775-control'));

        // await Promise.race([
        //     new Promise(resolve => {
        //         chrome.runtime.sendMessage({
        //             name: 'web-request-oncompleted',
        //             url: 'https://seller.walmart.com/resource/item/commissions'
        //         }, (response) => {
        //             console.log("web-request-oncompleted", response, new Date().getTime())
        //             document.documentElement.style.background = 'red'
        //             resolve();
        //         })
        //     }),
        //     new Promise(resolve => setTimeout(resolve, 1000 * 10))
        // ])


        // document.querySelector('._1QQQZ').focus()
        // document.querySelector('.css-lg2xwb-container').focus()
        // document.querySelector('.css-kry775-control').focus()










        // 这里执行业务逻辑，完成后通过sendResponse返回结果
        sendResponse({
            name: `echo_${name}`,
            data: {
                status: 'success', // 'success' or 'fail'
                data: {
                    message: 'hello'            // 下载文件提供 文件url
                },
            }
            // 如果失败，data.message提供失败原因
            /*
            data: {
              status: 'fail',
              data: {
                message: 'xxxxx',
              },
            }
            */
        })
    }

    return true;
});



