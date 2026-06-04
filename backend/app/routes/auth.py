from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.auth import LoginRequest, LoginResponse, UserProfile
from app.services.auth_service import authenticate_user
from app.services.log_service import log_activity_async
from app.utils.jwt import create_access_token
from app.utils.rbac import get_current_user

router = APIRouter(prefix="/auth", tags=["Auth"])


def to_profile(user) -> UserProfile:
    return UserProfile(
        id=user.id,
        name=user.name,
        email=user.email,
        role=user.role.name,
    )


@router.post("/login", response_model=LoginResponse)
def login(
    payload: LoginRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    user = authenticate_user(db, payload.email, payload.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token = create_access_token({"sub": str(user.id), "role": user.role.name})
    background_tasks.add_task(log_activity_async, user.id, "login", "User logged in")
    return LoginResponse(access_token=token, user=to_profile(user))


@router.post("/token", response_model=LoginResponse)
def token_login(
    background_tasks: BackgroundTasks,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token = create_access_token({"sub": str(user.id), "role": user.role.name})
    background_tasks.add_task(
        log_activity_async, user.id, "login", "User logged in via Swagger"
    )
    return LoginResponse(access_token=token, user=to_profile(user))


@router.get("/me", response_model=UserProfile)
def me(current_user=Depends(get_current_user)):
    return to_profile(current_user)
