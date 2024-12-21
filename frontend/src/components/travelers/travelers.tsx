import React, {useEffect} from "react"

import Aos from "aos"
import "aos/dist/aos.css"

const travelers = [
    {
        id: 1,
        destinationImage: "/paris.jpg",
        destinationName: "Paris, France",
        travelerImage: "/user.jpg",
        travelerName: "Chu Viet Kien",
        socialLink: "@chuvietkien"
    },

    {
        id: 2,
        destinationImage: "/dubai.jpg",
        destinationName: "Dubai, UAE",
        travelerImage: "/user.jpg",
        travelerName: "Vu Thi Ngoc Thanh",
        socialLink: "@vuthingocthanh"
    },

    {
        id: 3,
        destinationImage: "/london.jpg",
        destinationName: "London, England",
        travelerImage: "/user.jpg",
        travelerName: "Pham Mai Anh",
        socialLink: "@phammaianh"
    },

    {
        id: 4,
        destinationImage: "/tokyo.jpg",
        destinationName: "Tokyo, Japan",
        travelerImage: "/user.jpg",
        travelerName: "John Smith",
        socialLink: "@johnsmith_jp"
    },
    
    {
        id: 5,
        destinationImage: "/new-york.jpg",
        destinationName: "New York, USA",
        travelerImage: "/user.jpg",
        travelerName: "Emma Brown",
        socialLink: "@em_brown_ny"
    },
    
    {
        id: 6,
        destinationImage: "/hanoi.jpg",
        destinationName: "Hanoi, Vietnam",
        travelerImage: "/user.jpg",
        travelerName: "Olivia Davis",
        socialLink: "@oliviad_hn"
    },
    
    {
        id: 7,
        destinationImage: "/seoul.jpg",
        destinationName: "Seoul, Korea",
        travelerImage: "/user.jpg",
        travelerName: "Liam Kim",
        socialLink: "@liamkorea"
    },
    
    {
        id: 8,
        destinationImage: "/berlin.jpg",
        destinationName: "Berlin, Germany",
        travelerImage: "/user.jpg",
        travelerName: "Sophia Müller",
        socialLink: "@sophia_berlin"
    },    
]

const Travelers = () => {
    useEffect(() => {
        Aos.init({duration: 2000})
    }, []);
    
    return (
        <div className="travelers container section">
            <div className="sectionContainer">
                <h2 data-aos='fade-down' data-aos-duration='2500'>Top travelers of this month!</h2>

                <div className="travelersContainer grid">
                    {/* Single passsanger card */}
                    {
                        travelers.map(({ id, destinationImage, destinationName, travelerImage, travelerName, socialLink }) => {
                            return (
                                <div data-aos='fade-up' data-aos-duration='2500' key={id} className="singleTraveler">
                                    <img src={destinationImage} alt="" className="destinationImage" />
                                    <div className="travelerDetails">
                                        <div className="travelerPicture">
                                            <img src={travelerImage} alt="" className="travelerImage" />
                                        </div>

                                        <div className="travelerName">
                                            <span>{destinationName}</span>
                                            <p>{socialLink}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default Travelers