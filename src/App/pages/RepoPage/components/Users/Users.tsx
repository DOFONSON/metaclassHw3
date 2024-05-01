import { useState, useEffect } from 'react';
import Card from '../Card';
import BottomBtns from './components/BottomBtns/BottomBtns';
import ArrowButton from '../../../../../components/ArrowButton';
import style from './Users.module.scss'
import btnStyle from './components/BottomBtns/BottomBtns.module.scss'
import { observer } from 'mobx-react-lite';
import repoStore from '../../../../../store/RenderReposStore';
import ReposStore from '../../../../../store/RenderReposStore/RenderReposStore';
import LoadingStub from './components/LoadingStub';
import DefaultStub from './components/DefaultStub';
import ErrorStub from './components/ErrorStub';
const Users: React.FC = () => {
    const [arwBtnDisL, setArwBtnDisL] = useState(true);
    const [arwBtnDisR, setArwBtnDisR] = useState(false);
    const [btnsCount, setBtnsCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(repoStore.page);
    const reposPerPage = 9;
    let totalPages = Math.ceil(repoStore.renderedRepos.order.length / reposPerPage);

    useEffect(() => {
        repoStore

    }, []);
    useEffect(() => {
        repoStore.renderedRepos
    }, [repoStore.meta, totalPages]);

    useEffect(() => {
        const newBtnsCount = Math.ceil(repoStore.renderedRepos.order.length / reposPerPage);
        setBtnsCount(newBtnsCount);
        setCurrentPage(ReposStore.page)
    }, [repoStore.meta, repoStore.renderedRepos.order.length]);

    useEffect(() => {
        checkBtn(ReposStore.page + 1);
    }, [BottomBtns]);
    useEffect(() => {
        checkBtn(currentPage);
    }, [currentPage, totalPages]);

    const checkBtn = (i: number) => {
        if (i === 0) {
            setArwBtnDisL(true);
        } else {
            setArwBtnDisL(false);
        }

        if (i === btnsCount - 1) {
            setArwBtnDisR(true);
        } else {
            setArwBtnDisR(false);
        }
    }
    let btnArr = document.querySelectorAll('.' + btnStyle.repos_bottom_btn);

    const btnChanger = (ind: number) => {

        let btnArr = document.querySelectorAll('.' + btnStyle.repos_bottom_btn);

        for (let i = 0; i < btnArr.length; i++) {
            const element = btnArr[i];
            if (element.classList.contains(btnStyle.repos_bottom_btn_active)) {
                element.classList.remove(btnStyle.repos_bottom_btn_active);
                repoStore.changePage(ind - 1)

                checkBtn(ind - 1);
                setCurrentPage(repoStore.page)
                break;
            }
        }
        btnArr[ind - 1].classList.add(btnStyle.repos_bottom_btn_active);
    }
    useEffect(() => {
        setArwBtnDisL(currentPage === 0);
        setArwBtnDisR(currentPage === totalPages - 1);
    }, [currentPage, totalPages]);

    const nextPage = () => {
        repoStore.changePage(Math.min(repoStore.page + 1, totalPages - 1))
        setCurrentPage(repoStore.page);
        btnArr[currentPage].classList.remove(btnStyle.repos_bottom_btn_active);
        btnArr[currentPage + 1].classList.add(btnStyle.repos_bottom_btn_active);
    };

    const prevPage = () => {
        repoStore.changePage(Math.max(repoStore.page - 1, 0))
        setCurrentPage(repoStore.page);
        btnArr[currentPage].classList.remove(btnStyle.repos_bottom_btn_active);
        btnArr[currentPage - 1].classList.add(btnStyle.repos_bottom_btn_active);
    };

    return (
        <>
            {repoStore.meta == 'success' ? (
                <div>
                    <ul className={style.repos}>
                        {repoStore.renderedRepos.order
                            .slice(currentPage * reposPerPage, (currentPage + 1) * reposPerPage)
                            .map((repo: number) => (
                                <li key={repoStore.renderedRepos.entities[repo].id}><Card id={repoStore.renderedRepos.entities[repo].id} className={style.repo_card__link} image={repoStore.renderedRepos.entities[repo].avatarUrl} captionSlot={repoStore.renderedRepos.entities[repo].stargazersCount} dateSlot={repoStore.renderedRepos.entities[repo].updatedAt} title={repoStore.renderedRepos.entities[repo].name} contentSlot={repoStore.renderedRepos.entities[repo].description} /></li>
                            ))}
                    </ul>

                    <div className={style.repos_bottom_btns}>
                        <ArrowButton side='left' disabled={arwBtnDisL} onClick={prevPage}></ArrowButton>
                        <ul className={style.repos_bottom_btns__btns_list}>
                            <BottomBtns amount={btnsCount} onClick={(index: number) => btnChanger(index)} startIndex={ReposStore.page}></BottomBtns>
                        </ul>
                        <ArrowButton side='right' disabled={arwBtnDisR} onClick={nextPage}></ArrowButton>
                    </div>
                </div >
            ) : repoStore.meta == 'initial' ? <DefaultStub /> : repoStore.meta == 'loading' ? <LoadingStub /> : <ErrorStub />
            }
        </>
    );
}

export default observer(Users);